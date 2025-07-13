import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/expiry-deals.json');

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const deals = JSON.parse(data);
    return NextResponse.json(deals);
  } catch (err) {
    // If file doesn't exist, return empty array
    return NextResponse.json({ deals: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let deals = [];
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    deals = JSON.parse(data).deals || [];
  } catch (err) {
    deals = [];
  }
  // Upsert by barcode
  const idx = deals.findIndex((d: any) => d.barcode === body.barcode);
  if (idx > -1) {
    deals[idx] = { ...deals[idx], ...body };
  } else {
    deals.push(body);
  }
  await fs.writeFile(DATA_FILE, JSON.stringify({ deals }, null, 2), 'utf-8');
  return NextResponse.json({ success: true, deals });
} 