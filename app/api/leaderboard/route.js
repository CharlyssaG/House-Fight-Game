import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard').select('*').limit(50)
    if (error) throw error
    return Response.json({ leaderboard: data })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
