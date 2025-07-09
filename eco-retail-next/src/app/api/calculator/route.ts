import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { product } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }

  // Gemini API endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Prompt for Gemini
  const prompt = `Estimate the CO₂ emissions (in kg CO₂ per kg of product) for the following product: "${product}". Provide your answer as a JSON object with the following keys: manufacturing, packaging, shipping, total. Each value should represent the emissions per kg of product. Respond ONLY with the JSON object and no extra text or explanation.`;

  try {
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      throw new Error(`Gemini API error: ${geminiRes.status} - ${errorText}`);
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    let result = null;
    try {
      result = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from text if Gemini returns markdown or extra text
      const match = text && text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      }
    }
    if (!result) throw new Error('Failed to parse Gemini response. Raw response: ' + text);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gemini API error.' }, { status: 500 });
  }
} 