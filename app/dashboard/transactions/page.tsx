"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { getAuthData, getTransactions } from "@/lib/db"
import { useLanguage } from "@/lib/language-context"
import { formatGBP } from "@/lib/format"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface User {
  email: string
  name: string
  balance: number
  accountNumber: string
}

interface Transaction {
  id: string
  type: "credit" | "debit"
  description: string
  amount: number
  date: string
  status: string
  iban?: string
  swift?: string
  reference?: string
}

export default function TransactionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const loadData = async () => {
      const authData = await getAuthData()
      if (!authData || !authData.isLoggedIn) {
        router.push("/login")
      } else {
        setUser(authData)
      }

      const allTransactions = await getTransactions()
      setTransactions(allTransactions)
    }
    loadData()
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("transactions.title")}</h1>
            <p className="text-muted-foreground">{t("transactions.subtitle")}</p>
          </div>

          <Card className="p-6">
            {transactions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{t("transactions.empty")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const isUserTransfer = !!transaction.iban && (!transaction.reference || !transaction.reference.startsWith("TRANSFER-"))

                  const TransactionRow = (
                    <div
                      className={`flex flex-col md:flex-row md:items-start md:justify-between gap-3 border-b border-border pb-4 last:border-0 last:pb-0 ${
                        isUserTransfer ? "cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-2" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                        <div
                          className={`flex h-8 w-8 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            transaction.type === "credit" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowDownLeft className="h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm md:text-base text-card-foreground truncate">
                            {transaction.description}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {new Date(transaction.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {transaction.reference && (
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground truncate">Ref: {transaction.reference}</p>
                          )}
                          {transaction.iban && (
                            <p className="mt-1 font-mono text-xs text-muted-foreground truncate">IBAN: {transaction.iban}</p>
                          )}
                        </div>
                      </div>
                      <div className="md:text-right pl-10 md:pl-0">
                        <p
                          className={`text-sm md:text-base font-semibold ${
                            transaction.type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatGBP(Math.abs(transaction.amount))}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? t("transactions.status.completed")
                            : t("transactions.status.pending")}
                        </span>
                      </div>
                    </div>
                  )

                  if (!isUserTransfer) {
                    return <div key={transaction.id}>{TransactionRow}</div>
                  }

                  return (
                    <Dialog key={transaction.id}>
                      <DialogTrigger asChild>{TransactionRow}</DialogTrigger>
                      <DialogContent className="sm:max-w-md w-full border-border bg-card shadow-lg p-0 overflow-hidden sm:rounded-xl">
                        <div className="bg-muted/50 px-6 py-4 border-b border-border flex justify-between items-center">
                          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary p-2 rounded-full">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                            {t("transactions.details.title")}
                          </DialogTitle>
                        </div>

                        <div className="p-6 space-y-6">
                          <div className="text-center space-y-1 pb-4 border-b border-border">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                              {t("transactions.details.amount")}
                            </p>
                            <p className="text-3xl font-bold tracking-tight text-foreground">
                              {formatGBP(Math.abs(transaction.amount))}
                            </p>
                            <p className="text-xs text-muted-foreground pt-1">
                              {new Date(transaction.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2 py-2">
                              <p className="text-muted-foreground font-medium col-span-1">{t("transactions.details.recipient")}</p>
                              <p className="text-foreground font-semibold text-right col-span-2">{transaction.description}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2">
                              <p className="text-muted-foreground font-medium col-span-1">{t("transactions.details.sender")}</p>
                              <p className="text-foreground font-medium text-right col-span-2">{user.name || "-"}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 bg-muted/40 rounded-md p-2 -mx-2">
                              <p className="text-muted-foreground font-medium col-span-1">IBAN</p>
                              <p className="text-foreground font-mono text-xs md:text-sm text-right col-span-2 break-all">
                                {transaction.iban}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 bg-muted/40 rounded-md p-2 -mx-2 mt-1">
                              <p className="text-muted-foreground font-medium col-span-1">SWIFT / BIC</p>
                              <p className="text-foreground font-mono text-xs md:text-sm text-right col-span-2">
                                {transaction.swift || "N/A"}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2">
                              <p className="text-muted-foreground font-medium col-span-1">{t("transactions.details.reference")}</p>
                              <p className="text-foreground text-right col-span-2 italic break-words">
                                {transaction.reference ? `"${transaction.reference}"` : "-"}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2">
                              <p className="text-muted-foreground font-medium col-span-1">{t("transactions.details.status")}</p>
                              <div className="col-span-2 flex justify-end">
                                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                  {t("transactions.details.success")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted px-6 py-4 text-xs text-muted-foreground text-center border-t border-border">
                          {t("transactions.details.footer")}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
