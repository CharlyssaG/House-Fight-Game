import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { roundId, roomId } = await request.json()

    // Get round + all submissions
    const { data: round } = await supabaseAdmin.from('rounds').select('*').eq('id', roundId).single()
    const { data: submissions } = await supabaseAdmin.from('submissions').select('*, profiles(display_name)').eq('round_id', roundId)

    if (!submissions?.length) return Response.json({ error: 'No submissions' }, { status: 400 })

    // Update round status
    await supabaseAdmin.from('rounds').update({ status: 'simulating' }).eq('id', roundId)
    await supabaseAdmin.from('rooms').update({ status: 'simulating' }).eq('id', roomId)

    const results = []

    for (const sub of submissions) {
      const prompt = `You are the fight simulator for The House Fight Game — a hilarious party game.

Anchor (Fighter A): ${round.anchor_name}${round.anchor_desc ? ' — ' + round.anchor_desc : ''}
Challenger (Fighter B): ${sub.challenger_name}${sub.challenger_desc ? ' — ' + sub.challenger_desc : ''}

Return ONLY valid JSON, no markdown:
{
  "winner": "a" or "b",
  "winnerPct": integer 53-92,
  "stats": [
    {"name": "max 11 chars", "a": integer 5-95, "b": integer 5-95},
    {"name": "max 11 chars", "a": integer 5-95, "b": integer 5-95},
    {"name": "max 11 chars", "a": integer 5-95, "b": integer 5-95}
  ],
  "verdict": "One dry funny line. Max 75 chars.",
  "quip": "2-3 funny sentences on exactly how this fight went. Reference real character traits. No generic phrases. Worth reading aloud. Max 220 chars."
}`

      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })

      const raw = msg.content.find(c => c.type === 'text')?.text || '{}'
      const result = JSON.parse(raw.replace(/```json|```/g, '').trim())
      const isUpset = result.winner === 'b' && result.winnerPct < 60
      const challWinPct = result.winner === 'b' ? result.winnerPct : 100 - result.winnerPct

      // Save fight result
      const { data: fightResult } = await supabaseAdmin.from('fight_results').insert({
        round_id: roundId,
        submission_id: sub.id,
        player_id: sub.player_id,
        anchor_name: round.anchor_name,
        challenger_name: sub.challenger_name,
        winner: result.winner === 'b' ? 'challenger' : 'anchor',
        challenger_win_pct: challWinPct,
        stats: result.stats || [],
        verdict: result.verdict || '',
        quip: result.quip || '',
        is_upset: isUpset
      }).select().single()

      // Update player profile stats
      const won = result.winner === 'b'
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', sub.player_id).single()

      const updates = {
        total_rounds: (profile.total_rounds || 0) + 1,
        total_wins: (profile.total_wins || 0) + (won ? 1 : 0),
        total_losses: (profile.total_losses || 0) + (won ? 0 : 1),
      }

      // Track biggest upset
      if (won && challWinPct > (profile.biggest_upset_pct || 0)) {
        updates.biggest_upset_pct = challWinPct
        updates.biggest_upset_fighter = sub.challenger_name
        updates.biggest_upset_anchor = round.anchor_name
      }

      // Track favorite pick (most submitted name)
      // Simple approach: just update with current pick, could be improved
      if (!profile.favorite_pick) updates.favorite_pick = sub.challenger_name

      await supabaseAdmin.from('profiles').update(updates).eq('id', sub.player_id)

      results.push({ ...fightResult, submission: sub, result })
    }

    // Mark round and room complete
    await supabaseAdmin.from('rounds').update({ status: 'complete' }).eq('id', roundId)
    await supabaseAdmin.from('rooms').update({ status: 'results' }).eq('id', roomId)

    return Response.json({ results })
  } catch (err) {
    console.error(err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
