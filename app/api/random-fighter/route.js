import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET() {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: 'Generate a random fictional fighter for a party game. Pick ANY character from movies, TV, animation, games, books, mythology. Be creative and surprising — mix iconic with obscure, mix genres wildly. Respond ONLY valid JSON no markdown: {"name":"Character name","desc":"2-3 specific fight traits max 80 chars","origin":"Where from"}'
      }],
    });

    const raw = message.content.find(c => c.type === 'text')?.text || '{}';
    const fighter = JSON.parse(raw.replace(/```json|```/g, '').trim());

    return Response.json(fighter);
  } catch (err) {
    console.error('Random fighter error:', err);
    return Response.json({ error: 'Could not generate fighter' }, { status: 500 });
  }
}
