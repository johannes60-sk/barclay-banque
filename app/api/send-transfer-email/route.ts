import { NextResponse } from "next/server"
import { sendTransferEmail } from "@/lib/resend-emails"

export async function POST(request: Request) {
  try {
    const { beneficiaryEmail, beneficiaryName, amount, senderName, reference, iban, swift } = await request.json()

    const result = await sendTransferEmail({
      beneficiaryEmail,
      beneficiaryName,
      amount: parseFloat(amount),
      senderName,
      reference,
      iban,
      swift,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, emailId: result.emailId, emailSent: true })
  } catch (error: any) {
    console.error("[Transfer Email] API error:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to send email" }, { status: 500 })
  }
}
