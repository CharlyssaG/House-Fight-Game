export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { code, playerId } = await req.json()
    if (!code || !playerId) return Response.json({ error: 'Missing fields' }, { status: 400 })
    const { data: room, error } = await supabaseAdmin.from('rooms').select('*').eq('code', code.toUpperCase()).single()
    if (error || !room) return Response.json({ error: 'Room not found' }, { status: 404 })
    await supabaseAdmin.from('room_players').upsert({ room_id: room.id, player_id: playerId }, { onConflict: 'room_id,player_id' })
    return Response.json({ room })
  } catch (e) { return Response.json({ error: e.message }, { status: 500 }) }
}
