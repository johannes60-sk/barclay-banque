"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthData, getTransactions } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Loader2, Plus, Trash2 } from "lucide-react"
import { formatGBP } from "@/lib/format"

interface User {
  email: string
  name: string
  balance: number
  accountNumber: string
  id: string
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

interface FormData {
  type: string
  description: string
  amount: string
  date: string
  iban: string
  swift: string
  reference: string
  status: string
}

export default function AdminTransactionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    type: "credit",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 16),
    iban: "",
    swift: "",
    reference: "",
    status: "completed",
  })

  const loadTransactions = async () => {
    const txns = await getTransactions()
    setTransactions(txns)
  }

  useEffect(() => {
    const loadData = async () => {
      const authData = await getAuthData()
      if (!authData || !authData.isLoggedIn) {
        router.push("/login")
        return
      }
      setUser(authData)
      await loadTransactions()
    }
    loadData()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          type: formData.type,
          description: formData.description,
          amount: formData.amount,
          date: new Date(formData.date).toISOString(),
          iban: formData.iban,
          swift: formData.swift,
          reference: formData.reference,
          status: formData.status,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      setMessage({ type: "success", text: `Transaction added. New balance: ${formatGBP(result.newBalance)}` })

      setFormData({
        type: "credit",
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 16),
        iban: "",
        swift: "",
        reference: "",
        status: "completed",
      })

      await loadTransactions()
      const authData = await getAuthData()
      if (authData) setUser(authData)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (txId: string) => {
    if (!user || !confirm("Delete this transaction?")) return

    setDeletingId(txId)
    try {
      const response = await fetch("/api/admin/delete-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: txId, userId: user.id }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      setMessage({ type: "success", text: "Transaction deleted." })
      await loadTransactions()
      const authData = await getAuthData()
      if (authData) setUser(authData)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setDeletingId(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Admin — Transactions</h1>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="font-semibold text-foreground">
                  {user.name} — {user.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current balance</p>
                <p className="text-xl font-bold text-foreground">{formatGBP(user.balance)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              <Plus className="mr-2 inline h-5 w-5" />
              Add a transaction
            </h2>

            {message && (
              <div
                className={`mb-4 rounded-lg border p-3 text-sm ${
                  message.type === "success"
                    ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                    : "border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="credit">Credit (incoming)</option>
                    <option value="debit">Debit (outgoing)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description *</label>
                <Input
                  name="description"
                  placeholder="e.g. Transfer from Sophie Martin"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Amount (GBP) *</label>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="150.00"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Date *</label>
                  <Input name="date" type="datetime-local" value={formData.date} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">IBAN</label>
                  <Input
                    name="iban"
                    placeholder="GB29NWBK60161331926819"
                    value={formData.iban}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">SWIFT/BIC</label>
                  <Input name="swift" placeholder="BARCGB22" value={formData.swift} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Reference</label>
                <Input
                  name="reference"
                  placeholder="TRANSFER-IN-041"
                  value={formData.reference}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add transaction
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Existing transactions ({transactions.length})</h2>

            {transactions.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No transactions</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          tx.type === "credit"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        }`}
                      >
                        {tx.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {tx.iban && ` — ${tx.iban}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          tx.type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {formatGBP(Math.abs(tx.amount))}
                      </p>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="rounded p-1 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                      >
                        {deletingId === tx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
