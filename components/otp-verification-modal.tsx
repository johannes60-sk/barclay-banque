"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { Loader2, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface OTPVerificationModalProps {
  open: boolean
  onClose: () => void
  onVerify: (code: string) => Promise<void>
  onResend: () => Promise<void>
  userEmail: string
  expiresAt: string
}

export function OTPVerificationModal({
  open,
  onClose,
  onVerify,
  onResend,
  userEmail,
  expiresAt,
}: OTPVerificationModalProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [canResend, setCanResend] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (!open) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expires = new Date(expiresAt).getTime()
      const difference = expires - now
      const secondsLeft = Math.floor(difference / 1000)
      return secondsLeft > 0 ? secondsLeft : 0
    }

    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (300 - newTimeLeft >= 60) {
        setCanResend(true)
      }

      if (newTimeLeft <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [open, expiresAt])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (code.length !== 6) {
      setError(t("otp.error.invalid"))
      return
    }

    if (timeLeft <= 0) {
      setError(t("otp.error.expired"))
      return
    }

    setLoading(true)
    try {
      await onVerify(code)
    } catch (err: any) {
      setError(err.message || t("otp.error.generic"))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    setCode("")
    try {
      await onResend()
      setCanResend(false)
      setTimeLeft(300)
    } catch (err: any) {
      setError(err.message || t("otp.error.resend"))
    } finally {
      setResending(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setCode(value)
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{t("otp.title")}</DialogTitle>
          <DialogDescription className="text-center">{t("otp.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp-code" className="text-sm font-medium">
              {t("otp.code.label")}
            </label>
            <Input
              id="otp-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              disabled={loading || resending}
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("otp.time.remaining")}: <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading || resending || timeLeft <= 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("otp.verifying")}
                </>
              ) : (
                t("otp.verify")
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={!canResend || resending || loading}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("otp.resending")}
                </>
              ) : (
                t("otp.resend")
              )}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={onClose} disabled={loading || resending}>
              {t("otp.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
