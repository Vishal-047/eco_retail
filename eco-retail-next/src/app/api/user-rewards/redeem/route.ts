import { NextRequest, NextResponse } from 'next/server';

let userPoints = 120;
let userDiscounts = ['10% off next order'];

export async function POST() {
  if (userPoints < 100) {
    return NextResponse.json({ message: 'Not enough points to redeem.', points: userPoints, discounts: userDiscounts });
  }
  userPoints -= 100;
  userDiscounts.push('10% off next order');
  return NextResponse.json({ message: 'Discount redeemed!', points: userPoints, discounts: userDiscounts });
} 