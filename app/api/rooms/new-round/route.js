import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { roomId, anchorName, anchorDesc, hostId } = await request.json()

    const { data: room } = await supabaseAdmin.from('rooms').select('*').eq('id', roomId).single()
    if (room.host_id !== hostId) return Response.json({ error: 'Only host can start new round' }, { status: 403 })

    const newRoundNum = (room.current_round || 1) + 1

    await supabaseAdmin.from('rooms').update({
      anchor_name: anchorName, anchor_desc: anchorDesc || '',
      current_round: newRoundNum, status: 'submitting'
    }).eq('id', roomId)

    const { data: round } = await supabaseAdmin.from('rounds').insert({
      room_id: roomId, round_number: newRoundNum,
      anchor_name: anchorName, anchor_desc: anchorDesc || '', status: 'submitting'
    }).select().single()

    return Response.json({ round })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
