import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;
const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name, phone, password, email } = await req.json();
  console.log('Received registration:', { name, phone, password, email });
  if (!phone || typeof phone !== 'string' || !/^\+\d{10,15}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid or missing phone number. Must be in E.164 format (e.g., +911234567890)." }, { status: 400 });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  const updateObj = { name, phone, email, password, otp, otpExpires };
  console.log('Saving to MongoDB:', updateObj);
  await User.findOneAndUpdate(
    { phone },
    updateObj,
    { upsert: true }
  );

  // Send OTP via Twilio SMS
  try {
    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: twilioPhone,
      to: phone, // Should be a phone number in E.164 format
    });
  } catch (err) {
    console.error("Twilio SMS error:", err);
    return NextResponse.json({ error: "Failed to send OTP via SMS. Please check the phone number format (e.g., +911234567890) and Twilio settings." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 