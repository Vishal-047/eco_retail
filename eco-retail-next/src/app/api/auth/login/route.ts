import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { emailOrPhone, password } = await req.json();
  let user = null;
  if (/^\d{10}$/.test(emailOrPhone)) {
    // If it's a 10-digit phone number, prepend +91
    user = await User.findOne({ phone: `+91${emailOrPhone}` });
  } else if (/^\+\d{10,15}$/.test(emailOrPhone)) {
    // If it's already in E.164 format
    user = await User.findOne({ phone: emailOrPhone });
  } else {
    // Otherwise, treat as email
    user = await User.findOne({ email: emailOrPhone });
  }
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  // Return name, phone, and email
  return NextResponse.json({ success: true, user: { name: user.name, phone: user.phone, email: user.email } });
} 