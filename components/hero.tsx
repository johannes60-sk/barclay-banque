"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 px-6 py-16 lg:px-16">
        <h1 className="text-4xl font-bold text-balance" style={{ color: "#00395D" }}>
          {t("home.heroTitle")}
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">{t("home.heroSubtitle")}</p>
        <div className="flex gap-3">
          <Link href="/register">
            <Button size="lg">{t("home.openAccount")}</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              {t("home.login")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center p-10" style={{ backgroundColor: "#0068C9" }}>
        <p className="max-w-sm text-white text-2xl font-semibold text-pretty">{t("home.heroPanel")}</p>
      </div>
    </section>
  )
}
