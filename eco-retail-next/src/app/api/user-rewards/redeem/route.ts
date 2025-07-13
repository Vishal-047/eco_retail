import { NextRequest, NextResponse } from 'next/server';

// Import or share the users mock DB from the main user-rewards route (for now, redefine here)
let users = {};

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId || !users[userId]) {
    return NextResponse.json({ message: 'User not found.', points: 0, discounts: [] }, { status: 404 });
  }
  if (!users[userId].discounts) users[userId].discounts = [];
  if (users[userId].points < 100) {
    return NextResponse.json({ message: 'Not enough points to redeem.', points: users[userId].points, discounts: users[userId].discounts });
  }
  users[userId].points -= 100;
  users[userId].discounts.push('10% off next order');
  return NextResponse.json({ message: 'Discount redeemed!', points: users[userId].points, discounts: users[userId].discounts });
} 