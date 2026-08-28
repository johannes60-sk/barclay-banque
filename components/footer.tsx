"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "./language-switcher"

export function Footer() {
  const { t } = useLanguage()

  const columns = [
    {
      title: t("footer.products"),
      links: [
        { href: "/current-accounts", label: t("nav.currentAccounts") },
        { href: "/credit-cards", label: t("nav.creditCards") },
        { href: "/savings", label: t("nav.savings") },
        { href: "/loans", label: t("nav.loans") },
        { href: "/mortgages", label: t("nav.mortgages") },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/investments", label: t("nav.investments") },
        { href: "/insurance", label: t("nav.insurance") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/about", label: t("footer.privacyPolicy") },
        { href: "/about", label: t("footer.terms") },
      ],
    },
  ]

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-semibold mb-3">{col.title}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {col.links.map((l, i) => (
                <li key={`${l.label}-${i}`}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 flex flex-col items-center gap-3 text-center text-xs text-white/60">
        <span>
          © {new Date().getFullYear()} {t("footer.copyright")}
        </span>
        <LanguageSwitcher light />
      </div>
    </footer>
  )
}
