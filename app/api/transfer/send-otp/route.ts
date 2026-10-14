import { sendOTPEmail } from "@/lib/resend-emails";
import { generateOTPCode, getOTPExpirationDate, hashOTPCode } from "@/lib/otp";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { userEmail, transferData } = await request.json();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", userEmail)
      .single();

    if (profileError || !profile) {
      console.error("[OTP] Profile lookup failed for", userEmail, "->", profileError);
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("user_email", userEmail)
      .eq("used", false);

    const code = generateOTPCode();
    const codeHash = hashOTPCode(code);
    const expiresAt = getOTPExpirationDate();

    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .insert({
        user_email: userEmail,
        code_hash: codeHash,
        transfer_data: transferData,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (otpError) {
      return NextResponse.json(
        { success: false, error: "Failed to generate OTP" },
        { status: 500 },
      );
    }

    const emailResult = await sendOTPEmail({
      to: profile.email,
      code: code,
    });

    if (!emailResult.success) {
      await supabase.from("otp_codes").delete().eq("id", otpRecord.id);
      return NextResponse.json(
        { success: false, error: "Failed to send OTP email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      otpId: otpRecord.id,
      email: profile.email,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("[OTP] Error in send-otp route:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
