import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { transactionId, userId } = await request.json();

    if (!transactionId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: tx, error: txError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("id", transactionId)
      .eq("user_id", userId)
      .single();

    if (txError || !tx) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabase.from("transactions").delete().eq("id", transactionId);

    if (deleteError) {
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }

    const { data: profile } = await supabase.from("profiles").select("balance").eq("id", userId).single();

    if (profile) {
      const newBalance = profile.balance - tx.amount;
      await supabase.from("profiles").update({ balance: newBalance }).eq("id", userId);
    }

    return NextResponse.json({
      success: true,
      newBalance: profile ? profile.balance - tx.amount : null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
