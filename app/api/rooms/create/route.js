export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { hostId, anchorName, anchorDesc, isPublic } = await request.json()
    if (!hostId || !anchorName) return Response.json({ error: 'Missing fields' }, { status: 400 })

    let code, exists = true
    while (exists) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      code = Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      const { data } = await supabaseAdmin.from('rooms').select('id').eq('code', code).single()
      exists = !!data
    }

    const { data: room, error } = await supabaseAdmin
      .from('rooms').insert({ code, host_id: hostId, anchor_name: anchorName, anchor_desc: anchorDesc || '', is_public: isPublic !== false, status: 'submitting' })
      .select().single()
    if (error) throw error

    await supabaseAdmin.from('room_players').insert({ room_id: room.id, player_id: hostId })

    const { data: round } = await supabaseAdmin
      .from('rounds').insert({ room_id: room.id, round_number: 1, anchor_name: anchorName, anchor_desc: anchorDesc || '', status: 'submitting' })
      .select().single()

    return Response.json({ room, round })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
