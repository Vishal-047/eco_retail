import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Simulate dynamic community feed (replace with DB in production)
  const feed = [
    { user: 'Alice', achievement: 'Plastic-Free Shopper', time: '2 min ago' },
    { user: 'Bob', tip: 'Use bike delivery for zero emissions!', time: '5 min ago' },
    { user: 'Priya', achievement: 'Eco Saver', time: '10 min ago' },
    { user: 'Liam', tip: 'Switch to compostable packaging for your store.', time: '15 min ago' },
  ];
  return NextResponse.json({ feed });
} 