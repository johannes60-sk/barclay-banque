"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginUser, getAuthData } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await getAuthData()
      if (authData && authData.isLoggedIn) {
        router.push("/dashboard")
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (email && password) {
      try {
        const user = await loginUser(email, password)

        if (user) {
          router.push("/dashboard")
        } else {
          setError(t("auth.login.errorCredentials"))
        }
      } catch (err) {
        console.error("Login error:", err)
        setError(t("auth.login.error"))
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <Logo />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">{t("auth.login.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.login.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                {t("auth.login.email")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                {t("auth.login.password")}
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-muted-foreground">{t("auth.login.remember")}</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                {t("auth.login.forgot")}
              </a>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">{error}</div>
            )}

            <Button type="submit" className="w-full">
              {t("auth.login.submit")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline">
              {t("auth.login.signupLink")}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("auth.login.terms")}{" "}
          <Link href="/about" className="text-primary hover:underline">
            {t("auth.login.termsLink")}
          </Link>{" "}
          {t("auth.login.and")}{" "}
          <Link href="/about" className="text-primary hover:underline">
            {t("auth.login.privacy")}
          </Link>
        </p>
      </div>
    </div>
  )
}
