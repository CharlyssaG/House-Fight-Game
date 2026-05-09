export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single()
    const { data: history } = await supabaseAdmin.from('fight_results').select('*').eq('player_id', id).order('created_at',{ascending:false}).limit(20)
    return Response.json({ profile, history: history||[] })
  } catch (e) { return Response.json({ error: e.message }, { status: 500 }) }
}

export async function PATCH(req) {
  try {
    const { id, display_name, avatar_color } = await req.json()
    const { data, error } = await supabaseAdmin.from('profiles').update({ display_name, avatar_color }).eq('id', id).select().single()
    if (error) throw error
    return Response.json({ profile: data })
  } catch (e) { return Response.json({ error: e.message }, { status: 500 }) }
}
