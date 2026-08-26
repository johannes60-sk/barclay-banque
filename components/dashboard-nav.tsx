"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"
import { logoutUser } from "@/lib/db"

interface DashboardNavProps {
  user: {
    email: string
    name: string
  }
}

export function DashboardNav({ user }: DashboardNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = async () => {
    await logoutUser(user.email)
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-primary backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              {t("dashboard.nav.balance")}
            </Link>
            <Link
              href="/dashboard/transfer"
              className="text-sm font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              {t("dashboard.nav.transfer")}
            </Link>
            <Link
              href="/dashboard/transactions"
              className="text-sm font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              {t("dashboard.nav.transactions")}
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher light />
            <div className="text-right">
              <p className="text-sm font-medium text-primary-foreground">{user.name}</p>
              <p className="text-xs text-primary-foreground/70">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-white/20">
              <LogOut className="h-5 w-5 text-primary-foreground" />
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-primary-foreground" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.balance")}
              </Link>
              <Link
                href="/dashboard/transfer"
                className="text-sm font-medium text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.transfer")}
              </Link>
              <Link
                href="/dashboard/transactions"
                className="text-sm font-medium text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.nav.transactions")}
              </Link>
              <div className="border-t border-border pt-4">
                <div className="mb-3">
                  <LanguageSwitcher light />
                </div>
                <p className="mb-1 text-sm font-medium text-primary-foreground">{user.name}</p>
                <p className="mb-3 text-xs text-primary-foreground/70">{user.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full bg-transparent border-primary-foreground text-primary-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("dashboard.nav.logout")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
