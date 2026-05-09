export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { roundId, roomId } = await req.json()
    const { data: round } = await supabaseAdmin.from('rounds').select('*').eq('id', roundId).single()
    const { data: subs } = await supabaseAdmin.from('submissions').select('*, profiles(display_name, avatar_color)').eq('round_id', roundId)
    if (!subs?.length) return Response.json({ error: 'No submissions' }, { status: 400 })

    await supabaseAdmin.from('rounds').update({ status: 'simulating' }).eq('id', roundId)
    await supabaseAdmin.from('rooms').update({ status: 'simulating' }).eq('id', roomId)

    const results = []
    for (const sub of subs) {
      const anchorInfo = round.anchor_name + (round.anchor_desc ? ' — ' + round.anchor_desc : '')
      const challInfo = sub.challenger_name + (sub.challenger_desc ? ' — ' + sub.challenger_desc : '')
      const prompt = 'You are the fight simulator for The House Fight Game.\n' +
        'Anchor (Fighter A): ' + anchorInfo + '\n' +
        'Challenger (Fighter B): ' + challInfo + '\n\n' +
        'Return ONLY valid JSON no markdown:\n' +
        '{"winner":"a" or "b","winnerPct":integer 53-92,' +
        '"stats":[{"name":"max 11ch","a":int,"b":int},{"name":"max 11ch","a":int,"b":int},{"name":"max 11ch","a":int,"b":int}],' +
        '"verdict":"One dry funny line max 75 chars.",' +
        '"quip":"2-3 funny sentences on exactly how this fight went. Reference real character traits. No generic phrases. Max 220 chars."}'

      const msg = await anthropic.messages.create({ model:'claude-sonnet-4-5', max_tokens:600, messages:[{role:'user',content:prompt}] })
      const raw = msg.content.find(c=>c.type==='text')?.text || '{}'
      const res = JSON.parse(raw.replace(/```json|```/g,'').trim())
      const challPct = res.winner==='b' ? res.winnerPct : 100-res.winnerPct
      const isUpset = res.winner==='b' && challPct < 60

      const { data: fr } = await supabaseAdmin.from('fight_results').insert({
        round_id: roundId, submission_id: sub.id, player_id: sub.player_id,
        anchor_name: round.anchor_name, challenger_name: sub.challenger_name,
        winner: res.winner==='b' ? 'challenger' : 'anchor',
        challenger_win_pct: challPct, stats: res.stats||[], verdict: res.verdict||'', quip: res.quip||'', is_upset: isUpset
      }).select().single()

      const { data: prof } = await supabaseAdmin.from('profiles').select('*').eq('id', sub.player_id).single()
      const won = res.winner==='b'
      const upd = {
        total_rounds: (prof.total_rounds||0)+1,
        total_wins: (prof.total_wins||0)+(won?1:0),
        total_losses: (prof.total_losses||0)+(won?0:1),
      }
      if (won && challPct > (prof.biggest_upset_pct||0)) {
        upd.biggest_upset_pct = challPct
        upd.biggest_upset_fighter = sub.challenger_name
        upd.biggest_upset_anchor = round.anchor_name
      }
      await supabaseAdmin.from('profiles').update(upd).eq('id', sub.player_id)
      results.push(fr)
    }

    await supabaseAdmin.from('rounds').update({ status:'complete' }).eq('id', roundId)
    await supabaseAdmin.from('rooms').update({ status:'results' }).eq('id', roomId)
    return Response.json({ results })
  } catch (e) { console.error(e); return Response.json({ error: e.message }, { status: 500 }) }
}
