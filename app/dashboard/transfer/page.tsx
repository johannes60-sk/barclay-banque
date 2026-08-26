"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { TransferForm } from "@/components/transfer-form"
import { getAuthData } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"

interface User {
  email: string
  name: string
  balance: number
  accountNumber: string
}

export default function TransferPage() {
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
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("transfer.title")}</h1>
            <p className="text-muted-foreground">{t("transfer.subtitle")}</p>
          </div>

          <TransferForm user={user} />
        </div>
      </main>
    </div>
  )
}
