import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { product, image, language } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }

  // Gemini API endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Prompt for Gemini
  let prompt = `Suggest 2–3 sustainable packaging materials for the following product: "${product}".`;
  if (image) {
    prompt += ' The user has also uploaded an image of the product. Use this information if possible.';
  }
  prompt += ' For each option, provide: Material name, Reason for recommendation, CO₂ footprint (estimate), Recyclability rating (1–5), Eco-labels/tags (e.g., "100% recyclable"), and Green compliance tips. Respond ONLY with a JSON array of objects with keys: material, reason, co2, recyclability, ecoLabels, tips, and NO extra text or explanation.';
  if (language === 'hi') {
    prompt += ' Respond in Hindi, but still use the JSON array format as described, and NO extra text or explanation.';
  }

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
    // Extract the text response
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    // Try to parse JSON from the response
    let suggestions = null;
    try {
      suggestions = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from text if Gemini returns markdown or extra text
      // Use [\s\S]* instead of .*, to match across lines without 's' flag
      const match = text && text.match(/\[[\s\S]*\]/);
      if (match) {
        suggestions = JSON.parse(match[0]);
      }
    }
    if (!suggestions) throw new Error('Failed to parse Gemini response. Raw response: ' + text);
    return NextResponse.json({ suggestions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gemini API error. No fallback data.' }, { status: 500 });
  }
} 