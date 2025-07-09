import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userType, productType, goals } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const prompt = `You are an AI sustainability advisor. For a ${userType} focused on ${productType} whose main sustainability goals are: ${goals.join(", ")}, provide a JSON array of 5 practical, step-by-step actions (each as a string) to help them achieve their goals. Respond ONLY with the JSON array and no extra text or explanation.`;
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
    let roadmap = null;
    try {
      roadmap = JSON.parse(text);
    } catch (e) {
      const match = text && text.match(/\[[\s\S]*\]/);
      if (match) {
        roadmap = JSON.parse(match[0]);
      }
    }
    if (!roadmap) throw new Error('Failed to parse Gemini response. Raw response: ' + text);
    return NextResponse.json({ roadmap });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gemini API error.' }, { status: 500 });
  }
} 