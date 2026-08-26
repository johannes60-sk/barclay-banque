"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "./ui/button"
import { useLanguage } from "@/lib/language-context"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const navLinks = [
    { href: "/current-accounts", label: t("nav.currentAccounts") },
    { href: "/credit-cards", label: t("nav.creditCards") },
    { href: "/savings", label: t("nav.savings") },
    { href: "/loans", label: t("nav.loans") },
    { href: "/mortgages", label: t("nav.mortgages") },
    { href: "/insurance", label: t("nav.insurance") },
    { href: "/investments", label: t("nav.investments") },
    { href: "/about", label: t("nav.about") },
  ]

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher light />
          <Link href="/login">
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10">
              {t("nav.login")}
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-primary hover:bg-white/90">{t("nav.signup")}</Button>
          </Link>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden flex flex-col gap-3 px-4 pb-4">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium">
            {t("nav.login")}
          </Link>
          <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-medium">
            {t("nav.signup")}
          </Link>
          <div className="pt-2">
            <LanguageSwitcher light />
          </div>
        </nav>
      )}
    </header>
  )
}
