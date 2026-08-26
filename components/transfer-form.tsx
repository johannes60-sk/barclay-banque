"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/language-context"
import { formatGBP } from "@/lib/format"
import { OTPVerificationModal } from "@/components/otp-verification-modal"

interface TransferFormProps {
  user: {
    email: string
    name: string
    balance: number
  }
}

interface TransferData {
  iban: string
  swift: string
  beneficiaryName: string
  beneficiaryEmail: string
  amount: string
  reference: string
}

export function TransferForm({ user }: TransferFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const [formData, setFormData] = useState<TransferData>({
    iban: "",
    swift: "",
    beneficiaryName: "",
    beneficiaryEmail: "",
    amount: "",
    reference: "",
  })

  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otpEmail, setOtpEmail] = useState("")
  const [otpExpiresAt, setOtpExpiresAt] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const buildTransferPayload = () => ({
    iban: formData.iban,
    swift: formData.swift,
    beneficiaryName: formData.beneficiaryName,
    beneficiaryEmail: formData.beneficiaryEmail,
    amount: formData.amount,
    reference: formData.reference,
    userBalance: user.balance,
    userName: user.name,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/transfer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          transferData: buildTransferPayload(),
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || t("transfer.error.generic"))
      }

      setOtpEmail(result.email)
      setOtpExpiresAt(result.expiresAt)
      setShowOTPModal(true)
      setLoading(false)
    } catch (err: any) {
      console.error("[Transfer] Failed to send OTP:", err)
      setError(err.message || t("transfer.error.generic"))
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (code: string) => {
    const response = await fetch("/api/transfer/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: user.email,
        otpCode: code,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || t("transfer.error.otp"))
    }

    setShowOTPModal(false)
    router.push("/dashboard/transfer/success")
  }

  const handleResendOTP = async () => {
    const response = await fetch("/api/transfer/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: user.email,
        transferData: buildTransferPayload(),
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || t("otp.error.resend"))
    }

    setOtpExpiresAt(result.expiresAt)
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-1">
          <div>
            <label htmlFor="beneficiaryName" className="mb-2 block text-sm font-medium text-foreground">
              {t("transfer.recipient")} *
            </label>
            <Input
              id="beneficiaryName"
              name="beneficiaryName"
              placeholder={t("transfer.recipient.placeholder")}
              value={formData.beneficiaryName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="beneficiaryEmail" className="mb-2 block text-sm font-medium text-foreground">
              {t("transfer.email")} *
            </label>
            <Input
              id="beneficiaryEmail"
              name="beneficiaryEmail"
              type="email"
              placeholder={t("transfer.email.placeholder")}
              value={formData.beneficiaryEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="iban" className="mb-2 block text-sm font-medium text-foreground">
              IBAN *
            </label>
            <Input
              id="iban"
              name="iban"
              placeholder={t("transfer.iban.placeholder")}
              value={formData.iban}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="swift" className="mb-2 block text-sm font-medium text-foreground">
              {t("transfer.swift")} *
            </label>
            <Input
              id="swift"
              name="swift"
              placeholder={t("transfer.swift.placeholder")}
              value={formData.swift}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-foreground">
            {t("transfer.amount")} (GBP) *
          </label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={user.balance}
            placeholder={t("transfer.amount.placeholder")}
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.balance")}: {formatGBP(user.balance)}
          </p>
        </div>

        <div>
          <label htmlFor="reference" className="mb-2 block text-sm font-medium text-foreground">
            {t("transfer.reference")}
          </label>
          <Textarea
            id="reference"
            name="reference"
            placeholder={t("transfer.reference.placeholder")}
            value={formData.reference}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="mb-2 font-semibold text-foreground">{t("transfer.summary")}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transfer.amount")}:</span>
              <span className="font-medium text-foreground">
                {formData.amount ? formatGBP(Number.parseFloat(formData.amount)) : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transfer.fees")}:</span>
              <span className="font-medium text-accent">{t("transfer.free")}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1">
              <span className="font-medium text-foreground">{t("transfer.total")}:</span>
              <span className="font-bold text-foreground">
                {formData.amount ? formatGBP(Number.parseFloat(formData.amount)) : "-"}
              </span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("transfer.processing")}
            </>
          ) : (
            <>
              {t("transfer.submit")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <OTPVerificationModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        userEmail={otpEmail}
        expiresAt={otpExpiresAt}
      />
    </Card>
  )
}
