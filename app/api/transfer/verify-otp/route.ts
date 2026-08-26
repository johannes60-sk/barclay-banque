import { sendTransferEmail } from "@/lib/resend-emails";
import { isOTPExpired, verifyOTPCode } from "@/lib/otp";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const MAX_ATTEMPTS = 3;

export async function POST(request: Request) {
  try {
    const { userEmail, otpCode } = await request.json();

    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("user_email", userEmail)
      .eq("used", false)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid OTP code found. Please request a new one.",
        },
        { status: 404 },
      );
    }

    if (isOTPExpired(otpRecord.expires_at)) {
      await supabase.from("otp_codes").update({ used: true }).eq("id", otpRecord.id);
      return NextResponse.json(
        { success: false, error: "OTP code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await supabase.from("otp_codes").update({ used: true }).eq("id", otpRecord.id);
      return NextResponse.json(
        { success: false, error: "Maximum verification attempts exceeded. Please request a new code." },
        { status: 400 },
      );
    }

    const isValid = verifyOTPCode(otpCode, otpRecord.code_hash);

    if (!isValid) {
      const newAttempts = otpRecord.attempts + 1;
      await supabase.from("otp_codes").update({ attempts: newAttempts }).eq("id", otpRecord.id);

      const attemptsLeft = MAX_ATTEMPTS - newAttempts;

      return NextResponse.json(
        {
          success: false,
          error: `Invalid code. ${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining.`,
          attemptsLeft,
        },
        { status: 400 },
      );
    }

    await supabase.from("otp_codes").update({ verified: true, used: true }).eq("id", otpRecord.id);

    const transferData = otpRecord.transfer_data as any;
    const { iban, swift, beneficiaryName, beneficiaryEmail, amount, reference, userName } = transferData;

    try {
      const { data: userProfile, error: userError } = await supabase
        .from("profiles")
        .select("id, balance")
        .eq("email", userEmail)
        .single();

      if (userError || !userProfile) {
        throw new Error("User not found");
      }

      const amountFloat = parseFloat(amount);

      const newTransaction = {
        user_id: userProfile.id,
        type: "debit",
        description: `Transfer to ${beneficiaryName}`,
        amount: -amountFloat,
        date: new Date().toISOString(),
        status: "completed",
        iban,
        swift,
        reference,
      };

      const { error: transactionError } = await supabase.from("transactions").insert(newTransaction);

      if (transactionError) {
        throw new Error("Failed to save transaction: " + transactionError.message);
      }

      const updatedBalance = userProfile.balance - amountFloat;
      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ balance: updatedBalance })
        .eq("id", userProfile.id);

      if (balanceError) {
        throw new Error("Failed to update balance: " + balanceError.message);
      }

      try {
        await sendTransferEmail({
          beneficiaryEmail,
          beneficiaryName,
          amount: amountFloat,
          senderName: userName,
          reference: reference || "",
          iban,
          swift,
        });
      } catch (emailError) {
        console.warn("[OTP] Email notification failed (non-blocking):", emailError);
      }

      return NextResponse.json({
        success: true,
        message: "Transfer completed successfully",
        transaction: newTransaction,
      });
    } catch (transferError: any) {
      console.error("[OTP] Transfer failed:", transferError);
      return NextResponse.json(
        { success: false, error: "Transfer failed: " + transferError.message },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("[OTP] Error in verify-otp route:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
