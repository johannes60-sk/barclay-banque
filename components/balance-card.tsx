"use client"

import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { formatGBP } from "@/lib/format"

interface BalanceCardProps {
  balance: number
  accountNumber: string
}

export function BalanceCard({ balance, accountNumber }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const { t } = useLanguage()

  return (
    <Card className="relative w-full overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8 text-primary-foreground shadow-xl">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-white/10" />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col gap-2 w-full mb-1">
              <span style={{ alignSelf: "flex-start" }} className="text-xs text-primary-foreground/70 font-semibold">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              <p className="text-sm font-medium text-primary-foreground/80">{t("dashboard.balance")}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {showBalance ? (
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap">
                  {formatGBP(balance)}
                </p>
              ) : (
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">••••••</p>
              )}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="rounded-lg p-2 transition-colors hover:bg-white/10 flex-shrink-0"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-primary-foreground/80">
            {t("dashboard.accountNumber")}: <span className="font-mono">{accountNumber}</span>
          </p>
        </div>
      </div>
    </Card>
  )
}
