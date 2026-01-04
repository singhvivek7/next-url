"use client"

import { CreditCard, Receipt,Settings as SettingsIcon, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { PlanTab } from "@/components/dashboard/plan-tab"
import { ProfileTab } from "@/components/dashboard/profile-tab"
import { TransactionTab } from "@/components/dashboard/transaction-tab"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const activeTab = (searchParams.get("tab") as "profile" | "general" | "plan" | "transactions") || "profile"

  const setActiveTab = (tab: "profile" | "general" | "plan" | "transactions") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.push(`/settings?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "profile"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("plan")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "plan"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            <CreditCard className="h-4 w-4" />
            Plan
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("transactions")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "transactions"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            <Receipt className="h-4 w-4" />
            Transactions
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("general")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "general"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            General
          </Button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "plan" && <PlanTab />}
        {activeTab === "transactions" && <TransactionTab />}

        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-none p-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <p className="text-muted-foreground">
                Configure general application settings.
              </p>
              {/* Add general settings form here */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
