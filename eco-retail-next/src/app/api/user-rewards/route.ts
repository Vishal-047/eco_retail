import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Simulate dynamic user data (replace with DB in production)
  const user = {
    points: 120, // Example: user has 120 points
    badges: ['Plastic-Free Shopper', 'Bike Delivery Champion', 'Eco Saver'],
    discounts: ['10% off next order'],
  };
  return NextResponse.json({ user });
} 