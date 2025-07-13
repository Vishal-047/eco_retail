import { NextRequest, NextResponse } from 'next/server';

// Mock DB (replace with real DB logic)
let activities = [
  {
    id: '1',
    userId: 'user123',
    type: 'upcycle',
    description: 'Made a wallet from old jeans',
    points: 0,
    date: new Date(Date.now() - 86400000),
    verified: false,
    proofUrl: 'https://example.com/photo.jpg'
  },
  {
    id: '2',
    userId: 'user456',
    type: 'social',
    description: 'Posted about my upcycled planter!',
    points: 0,
    date: new Date(Date.now() - 43200000),
    verified: false,
    proofUrl: 'https://instagram.com/my-post'
  },
  {
    id: '3',
    userId: 'user789',
    type: 'packaging',
    description: 'Used compostable mailers for shipping',
    points: 8,
    date: new Date(Date.now() - 21600000),
    verified: true,
    proofUrl: ''
  }
];
let users = {};

const POINTS_BY_TYPE = {
  upcycle: 15,
  packaging: 8,
  purchase: 10,
  social: 5,
};

export async function GET() {
  // Admin: fetch all activities for review (replace with DB query)
  return NextResponse.json({ activities });
}

export async function POST(req: NextRequest) {
  // User: submit a new activity
  const { userId, type, description, proofUrl } = await req.json();
  // TODO: Validate input, authenticate user, and save to DB
  const autoVerify = type === 'purchase' || type === 'packaging';
  const points = POINTS_BY_TYPE[type] || 0;
  const newActivity = {
    userId,
    type,
    description,
    points: autoVerify ? points : 0, // Award points immediately for auto-verified types
    date: new Date(),
    verified: autoVerify,
    proofUrl: proofUrl || null
  };
  activities.push(newActivity);
  // Update user points (mock)
  if (!users[userId]) users[userId] = { points: 0, badges: [], activities: [] };
  if (autoVerify) {
    users[userId].points += points;
  }
  users[userId].activities.push(newActivity);
  return NextResponse.json({ success: true, activity: newActivity, user: users[userId] });
}

export async function PUT(req: NextRequest) {
  const { id, action } = await req.json();
  const activity = activities.find(a => a.id === id);
  if (!activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  if (action === 'approve') {
    activity.verified = true;
    activity.points = 10; // or set based on type
  } else if (action === 'reject') {
    activity.verified = false;
    activity.points = 0;
  }
  return NextResponse.json({ success: true, activity });
} 