import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { userId, type, description, amount, date, iban, swift, reference, status } = await request.json();

    if (!userId || !type || !description || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const amountFloat = parseFloat(amount);
    const transactionAmount = type === "debit" ? -Math.abs(amountFloat) : Math.abs(amountFloat);

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type,
        description,
        amount: transactionAmount,
        date: date || new Date().toISOString(),
        status: status || "completed",
        iban: iban || null,
        swift: swift || null,
        reference: reference || null,
      })
      .select()
      .single();

    if (txError) {
      console.error("[Admin] Transaction insert error:", txError);
      return NextResponse.json({ success: false, error: txError.message }, { status: 500 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const newBalance = profile.balance + transactionAmount;
    const { error: balanceError } = await supabase.from("profiles").update({ balance: newBalance }).eq("id", userId);

    if (balanceError) {
      return NextResponse.json({ success: false, error: balanceError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transaction,
      newBalance,
    });
  } catch (error: any) {
    console.error("[Admin] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
