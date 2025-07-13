import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { phone, email } = await req.json();
  let user = null;
  if (phone) {
    user = await User.findOne({ phone });
  } else if (email) {
    user = await User.findOne({ email });
  }
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ name: user.name, phone: user.phone, email: user.email });
} 