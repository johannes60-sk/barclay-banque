"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { BalanceCard } from "@/components/balance-card"
import { QuickActions } from "@/components/quick-actions"
import { RecentTransactions } from "@/components/recent-transactions"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { getAuthData } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"

interface User {
  email: string
  name: string
  balance: number
  accountNumber: string
  firstName?: string
  lastName?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const loadUserData = async () => {
    const authData = await getAuthData()
    if (!authData || !authData.isLoggedIn) {
      router.push("/login")
    } else {
      setUser(authData)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [router])

  useEffect(() => {
    const handleFocus = () => {
      loadUserData()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
            {t("dashboard.welcome")}, {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name}
          </h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2 space-y-6">
            <BalanceCard balance={user.balance} />
            <RecentTransactions />
          </div>

          <div className="min-w-0 space-y-6">
            <QuickActions />

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{t("dashboard.settings")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("dashboard.settingsDescription")}</p>
              <DeleteAccountDialog />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
