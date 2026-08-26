"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

const PRODUCT_ROUTES = [
  { href: "/current-accounts", key: "currentAccounts" },
  { href: "/credit-cards", key: "creditCards" },
  { href: "/savings", key: "savings" },
  { href: "/loans", key: "loans" },
  { href: "/mortgages", key: "mortgages" },
  { href: "/insurance", key: "insurance" },
  { href: "/investments", key: "investments" },
] as const

export default function Home() {
  const { t } = useLanguage()

  return (
    <>
      <Navbar />
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: "#00395D" }}>
          {t("home.sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_ROUTES.map((p) => (
            <Link key={p.href} href={p.href}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{t(`product.${p.key}.title` as any)}</CardTitle>
                  <CardDescription>{t(`product.${p.key}.desc` as any)}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <section className="py-16" style={{ backgroundColor: "#F2F2F2" }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#00395D" }}>
            {t("home.simpleTitle")}
          </h2>
          <p className="text-muted-foreground text-pretty">{t("home.simpleDesc")}</p>
        </div>
      </section>
      <Footer />
    </>
  )
}
