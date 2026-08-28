"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage, type TranslationKey } from "@/lib/language-context"

export function PlaceholderPage({ titleKey }: { titleKey: TranslationKey }) {
  const { t } = useLanguage()

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-24 text-center bg-background min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4 text-foreground">{t(titleKey)}</h1>
        <p className="text-muted-foreground">{t("placeholder.comingSoon")}</p>
      </section>
      <Footer />
    </>
  )
}
