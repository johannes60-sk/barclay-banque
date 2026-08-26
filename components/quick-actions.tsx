"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, List } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function QuickActions() {
  const { t } = useLanguage()

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold text-card-foreground">{t("dashboard.quickActions")}</h2>

      <div className="space-y-3">
        <Button asChild className="w-full justify-start" size="lg">
          <Link href="/dashboard/transfer">
            <ArrowUpRight className="mr-3 h-5 w-5" />
            {t("dashboard.transfer")}
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <Link href="/dashboard/transactions">
            <List className="mr-3 h-5 w-5" />
            {t("dashboard.viewAll")}
          </Link>
        </Button>
      </div>
    </Card>
  )
}
