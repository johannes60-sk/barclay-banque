"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 bg-background min-h-[420px] lg:min-h-[520px]">
      <div className="flex flex-col justify-center gap-5 px-6 py-16 lg:px-16 lg:py-24 bg-accent">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground/70">
          Personal banking
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-balance text-accent-foreground">
          {t("home.heroTitle")}
        </h1>
        <p className="text-base lg:text-lg text-accent-foreground/80 text-pretty max-w-md">
          {t("home.heroSubtitle")}
        </p>
      </div>
      <div className="relative min-h-[320px]">
        <Image src="/images/hero-home.avif" alt="" fill priority className="object-cover" />
      </div>
    </section>
  )
}
