import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { anchor, challenger } = await request.json();

    if (!anchor?.name || !challenger?.name) {
      return Response.json({ error: 'Missing fighter names' }, { status: 400 });
    }

    const prompt = `You are the fight simulator for The House Fight Game — a hilarious party game.

Anchor (Fighter A): ${anchor.name}${anchor.desc ? ' — ' + anchor.desc : ''}
Challenger (Fighter B): ${challenger.name}${challenger.desc ? ' — ' + challenger.desc : ''}

Return ONLY valid JSON, no markdown, no backticks:
{
  "winner": "a" or "b",
  "winnerPct": integer between 53 and 92,
  "stats": [
    {"name": "short stat name max 11 chars", "a": integer 5-95, "b": integer 5-95},
    {"name": "short stat name max 11 chars", "a": integer 5-95, "b": integer 5-95},
    {"name": "short stat name max 11 chars", "a": integer 5-95, "b": integer 5-95}
  ],
  "verdict": "One dry funny line summarizing the outcome. Max 75 chars.",
  "quip": "THIS IS THE MOST IMPORTANT FIELD. Write 2-3 funny sentences describing exactly how this specific fight went down. Reference the actual characters — their real abilities, weapons, quirks, weaknesses. Make it specific enough that someone could only have written it about THESE two fighters. Funny, vivid, worth reading aloud. 40-200 chars."
}

The quip must be character-specific. No generic phrases like 'it was close' or 'one walked away'. Upsets are welcome.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content.find(c => c.type === 'text')?.text || '{}';
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim());

    return Response.json(result);
  } catch (err) {
    console.error('Fight API error:', err);
    return Response.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
