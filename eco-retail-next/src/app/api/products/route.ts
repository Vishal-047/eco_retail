import { NextRequest, NextResponse } from 'next/server';

const productNames = [
  'T-shirt',
  'Laptop',
  'Book',
  'Plastic Bottle',
  'Chair',
  'Shoes',
];

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Fetch emissions for each product from Gemini
  const products = await Promise.all(productNames.map(async (name) => {
    const prompt = `For the product "${name}", provide a JSON object with keys: emissions (object with manufacturing, packaging, shipping, total in kg CO2 per kg), packaging (string), deliveryOptions (array of strings). Respond ONLY with the JSON object and no extra text or explanation.`;
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
        return { name, error: 'Failed to fetch emissions' };
      }
      const geminiData = await geminiRes.json();
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      let obj = null;
      try {
        obj = JSON.parse(text);
      } catch (e) {
        const match = text && text.match(/\{[\s\S]*\}/);
        if (match) {
          obj = JSON.parse(match[0]);
        }
      }
      if (!obj) return { name, error: 'Failed to parse Gemini response' };
      return { name, ...obj };
    } catch {
      return { name, error: 'Gemini API error' };
    }
  }));

  return NextResponse.json({ products });
} 