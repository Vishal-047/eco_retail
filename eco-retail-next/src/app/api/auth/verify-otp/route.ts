import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { phone, otp } = await req.json();
  const user = await User.findOne({ phone });
  if (!user || user.otp !== otp || user.otpExpires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  return NextResponse.json({ success: true });
} 