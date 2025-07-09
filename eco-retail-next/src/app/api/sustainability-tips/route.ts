import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const { searchParams } = new URL(req.url);
  const product = searchParams.get('product');
  let prompt;
  if (product) {
    prompt = `For the product "${product}", list 4 practical sustainability tips (one each for manufacturing, packaging, shipping, and store operations) and a 5-step sustainability roadmap for making this product more sustainable. Respond ONLY with a JSON object with keys: tips (array of 4 strings), roadmap (array of 5 strings), and NO extra text or explanation.`;
  } else {
    prompt = `List 4 practical sustainability tips for a business, one each for manufacturing, packaging, shipping, and store operations. Respond ONLY with a JSON array of strings, no extra text or explanation.`;
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
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    let tips = null;
    let roadmap = null;
    if (product) {
      try {
        const obj = JSON.parse(text);
        tips = obj.tips;
        roadmap = obj.roadmap;
      } catch (e) {
        const match = text && text.match(/\{[\s\S]*\}/);
        if (match) {
          const obj = JSON.parse(match[0]);
          tips = obj.tips;
          roadmap = obj.roadmap;
        }
      }
      if (!tips || !roadmap) throw new Error('Failed to parse Gemini response. Raw response: ' + text);
      return NextResponse.json({ tips, roadmap });
    } else {
      try {
        tips = JSON.parse(text);
      } catch (e) {
        const match = text && text.match(/\[[\s\S]*\]/);
        if (match) {
          tips = JSON.parse(match[0]);
        }
      }
      if (!tips) throw new Error('Failed to parse Gemini response. Raw response: ' + text);
      return NextResponse.json({ tips });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gemini API error.' }, { status: 500 });
  }
} 