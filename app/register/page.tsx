"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerUser, getAuthData } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"
import { Logo } from "@/components/logo"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.register.passwordMismatch"))
      return
    }

    if (formData.password.length < 6) {
      setError(t("auth.register.passwordShort"))
      return
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      setError(t("auth.register.phoneRequired"))
      return
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setError(t("auth.register.phoneInvalid"))
      return
    }

    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phoneNumber.trim(),
      )
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || t("auth.register.error"))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <Logo />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">{t("auth.register.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.register.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-foreground">
                  {t("auth.register.firstName")} *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder={t("auth.register.firstNamePlaceholder")}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-foreground">
                  {t("auth.register.lastName")} *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder={t("auth.register.lastNamePlaceholder")}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                {t("auth.register.email")} *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("auth.register.emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-foreground">
                {t("auth.register.phone")} *
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder={t("auth.register.phonePlaceholder")}
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                {t("auth.register.password")} *
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                {t("auth.register.confirmPassword")} *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full">
              {t("auth.register.submit")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.register.haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("auth.register.loginLink")}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t("auth.register.terms")}{" "}
          <Link href="/about" className="text-primary hover:underline">
            {t("auth.register.termsLink")}
          </Link>{" "}
          {t("auth.register.and")}{" "}
          <Link href="/about" className="text-primary hover:underline">
            {t("auth.register.privacy")}
          </Link>
        </p>
      </div>
    </div>
  )
}
