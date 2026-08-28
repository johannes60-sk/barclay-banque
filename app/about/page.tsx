"use client"

import { Shield, Users, Globe, Award } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-16 bg-background">
        <h1 className="text-3xl font-bold mb-6 text-foreground">{t("about.title")}</h1>
        <p className="text-lg text-muted-foreground mb-4 text-pretty">{t("about.intro1")}</p>
        <p className="text-lg text-muted-foreground mb-12 text-pretty">{t("about.intro2")}</p>

        <h2 className="text-2xl font-bold mb-6 text-foreground">{t("about.valuesTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Shield className="mb-2 text-primary" />
              <CardTitle>{t("about.security.title")}</CardTitle>
              <CardDescription>{t("about.security.desc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="mb-2 text-primary" />
              <CardTitle>{t("about.service.title")}</CardTitle>
              <CardDescription>{t("about.service.desc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Globe className="mb-2 text-primary" />
              <CardTitle>{t("about.international.title")}</CardTitle>
              <CardDescription>{t("about.international.desc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Award className="mb-2 text-primary" />
              <CardTitle>{t("about.certifications.title")}</CardTitle>
              <CardDescription>{t("about.certifications.desc")}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-foreground">{t("about.visionTitle")}</h2>
        <div className="space-y-4 text-muted-foreground text-pretty">
          <p>{t("about.vision.p1")}</p>
          <p>{t("about.vision.p2")}</p>
          <p>{t("about.vision.p3")}</p>
        </div>
      </section>
      <Footer />
    </>
  )
}
