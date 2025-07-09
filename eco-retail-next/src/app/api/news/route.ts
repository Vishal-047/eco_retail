import { NextRequest, NextResponse } from 'next/server';

const SUSTAINABILITY_KEYWORDS = [
  'sustainability',
  'climate change',
  'environment',
  'green',
  'eco',
  'carbon',
  'renewable',
  'biodiversity',
  'recycling',
  'net zero',
  'clean energy',
  'solar',
  'wind power',
  'plastic waste',
  'circular economy',
  'emissions',
  'pollution',
  'conservation',
  'sustainable',
  'nature',
  'wildlife',
  'deforestation',
  'ocean',
  'reforestation',
  'electric vehicle',
  'EV',
  'organic',
  'compost',
  'biodegradable',
  'zero waste',
  'energy efficiency'
];

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'News API key not configured.' }, { status: 500 });
  }
  // Use a joined OR query for NewsAPI
  const query = encodeURIComponent(SUSTAINABILITY_KEYWORDS.join(' OR '));
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`NewsAPI error: ${res.status} - ${errorText}`);
    }
    const data = await res.json();
    // Filter articles to only those with at least one keyword in title or description
    const filtered = (data.articles || []).filter((article: any) => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      return SUSTAINABILITY_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
    });
    return NextResponse.json({ articles: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch news.' }, { status: 500 });
  }
} 