"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"

interface User {
  email: string
  name: string
  balance: number
  accountNumber: string
}

export default function TransferSuccessPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser()
      if (!userData) {
        router.push("/login")
      } else {
        setUser(userData)
      }
    }
    loadUser()
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-12 w-12 text-accent" />
              </div>
            </div>

            <h1 className="mb-3 text-3xl font-bold text-foreground">{t("transfer.success.title")}</h1>

            <p className="mb-8 text-lg text-muted-foreground">{t("transfer.success.description")}</p>

            <div className="rounded-lg border border-border bg-muted/30 p-6 text-left mb-8">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {t("transfer.success.item1")}</li>
                <li>✓ {t("transfer.success.item2")}</li>
                <li>✓ {t("transfer.success.item3")}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">{t("transfer.success.backToDashboard")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/transfer">{t("transfer.success.newTransfer")}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
