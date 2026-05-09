export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { code, playerId } = await request.json()
    if (!code || !playerId) return Response.json({ error: 'Missing fields' }, { status: 400 })

    const { data: room, error } = await supabaseAdmin
      .from('rooms').select('*, rounds(*)').eq('code', code.toUpperCase()).single()
    if (error || !room) return Response.json({ error: 'Room not found' }, { status: 404 })
    if (room.status === 'complete') return Response.json({ error: 'This game is over' }, { status: 400 })

    // Add player if not already in room
    await supabaseAdmin.from('room_players')
      .upsert({ room_id: room.id, player_id: playerId }, { onConflict: 'room_id,player_id' })

    return Response.json({ room })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
