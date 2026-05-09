export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { roundId, playerId, challengerName, challengerDesc } = await req.json()
    if (!roundId || !playerId || !challengerName) return Response.json({ error: 'Missing fields' }, { status: 400 })
    const { data, error } = await supabaseAdmin.from('submissions')
      .upsert({ round_id: roundId, player_id: playerId, challenger_name: challengerName, challenger_desc: challengerDesc||'' }, { onConflict: 'round_id,player_id' })
      .select().single()
    if (error) throw error
    return Response.json({ submission: data })
  } catch (e) { return Response.json({ error: e.message }, { status: 500 }) }
}
