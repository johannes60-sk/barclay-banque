"use client"

import Link from "next/link"
import Image from "next/image"
import { PoundSterling, CreditCard, PiggyBank, HandCoins, Home as HomeIcon, ShieldCheck, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

const PRODUCT_ROUTES = [
  { href: "/current-accounts", key: "currentAccounts", icon: PoundSterling },
  { href: "/credit-cards", key: "creditCards", icon: CreditCard },
  { href: "/savings", key: "savings", icon: PiggyBank },
  { href: "/loans", key: "loans", icon: HandCoins },
  { href: "/mortgages", key: "mortgages", icon: HomeIcon },
  { href: "/insurance", key: "insurance", icon: ShieldCheck },
  { href: "/investments", key: "investments", icon: TrendingUp },
] as const

export default function Home() {
  const { t } = useLanguage()

  return (
    <>
      <Navbar />
      <Hero />

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground/70">
            {t("home.premier.eyebrow")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-balance text-accent-foreground">{t("home.premier.title")}</h2>
          <p className="mt-4 max-w-xl text-accent-foreground/80 text-pretty">{t("home.premier.desc")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/current-accounts">
              <Button size="lg" className="rounded-full">
                {t("home.premier.cta")}
              </Button>
            </Link>
          </div>
          <div className="mt-8 border-t border-accent-foreground/15 pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-medium text-accent-foreground">{t("home.premier.switchTitle")}</p>
            <Link href="/current-accounts">
              <Button variant="outline" className="rounded-full border-accent-foreground/40 text-accent-foreground hover:bg-white/10">
                {t("home.premier.switchCta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 bg-background">
        <h2 className="text-2xl font-bold mb-2 text-foreground">{t("home.sectionTitle")}</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">{t("home.heroSubtitle")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_ROUTES.map((p) => {
            const Icon = p.icon
            return (
              <Link key={p.href} href={p.href}>
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-full border border-border">
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <CardTitle>{t(`product.${p.key}.title` as any)}</CardTitle>
                    <CardDescription>{t(`product.${p.key}.desc` as any)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      {t(`product.${p.key}.title` as any)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-background p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t("home.offer.title")}</h2>
            <p className="text-muted-foreground text-pretty mb-6">{t("home.offer.desc")}</p>
            <Link href="/current-accounts">
              <Button className="rounded-full self-start">{t("home.offer.cta")}</Button>
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl bg-background">
            <div className="relative h-56">
              <Image src="/images/children-and-money.avif" alt="" fill className="object-cover" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-foreground">{t("home.children.title")}</h2>
              <p className="text-muted-foreground text-pretty mb-6">{t("home.children.desc")}</p>
              <Link href="/about">
                <Button variant="outline" className="rounded-full">
                  {t("home.children.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden order-2 lg:order-1">
            <Image src="/images/app-woman-with-phone.avif" alt="" fill className="object-cover" />
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-4 text-foreground">{t("home.app.title")}</h2>
            <p className="text-muted-foreground text-pretty mb-6">{t("home.app.desc")}</p>
            <Link href="/about">
              <Button className="rounded-full">{t("home.app.cta")}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-accent-foreground">{t("home.features.title")}</h2>
          <p className="text-accent-foreground/80 text-pretty mb-6">{t("home.features.desc")}</p>
          <Link href="/register">
            <Button className="rounded-full bg-white text-accent hover:bg-white/90">{t("home.features.cta")}</Button>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-secondary-foreground">{t("home.explorePremier.title")}</h2>
          <p className="text-muted-foreground text-pretty mb-6">{t("home.explorePremier.desc")}</p>
          <Link href="/current-accounts">
            <Button variant="outline" className="rounded-full">
              {t("home.explorePremier.cta")}
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 text-sm text-muted-foreground space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">{t("home.survey.title")}</h3>
            <p>{t("home.survey.desc")}</p>
          </div>
          <p>{t("home.survey.fca")}</p>
          <div>
            <h3 className="font-semibold text-foreground mb-1">{t("home.scams.title")}</h3>
            <p>{t("home.scams.desc")}</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
