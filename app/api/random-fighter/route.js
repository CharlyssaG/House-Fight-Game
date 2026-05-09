export const dynamic = 'force-dynamic'
import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET() {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-5', max_tokens: 200,
      messages: [{ role:'user', content:'Generate a random fictional fighter for a party game. ANY character from movies, TV, animation, games, books, mythology. Creative and surprising. ONLY valid JSON no markdown: {"name":"Character name","desc":"2-3 specific fight traits max 80 chars","origin":"Where from"}' }]
    })
    const raw = msg.content.find(c=>c.type==='text')?.text||'{}'
    return Response.json(JSON.parse(raw.replace(/```json|```/g,'').trim()))
  } catch (e) {
    return Response.json({ name:'Yzma', desc:'Evil sorceress, transforms people, wildly underestimated', origin:"Emperor's New Groove" })
  }
}
