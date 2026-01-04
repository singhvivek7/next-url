"use client"

import {
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { dashboardNav, type NavItem } from "@/config/routes"
import { siteConfig } from "@/config/site"
import { useProfile } from "@/hooks/use-profile"
import { cn } from "@/lib/utils"

import { UpgradeCard } from "./upgrade-card"
import { UpgradeDialog } from "./upgrade-dialog"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function DashboardSidebar({ isOpen, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const { data: profile } = useProfile()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    )
  }

  const renderNavigationItem = (item: NavItem, depth = 0) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`))
    const isExpanded = expandedItems.includes(item.name)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.name}>
        <div
          className={cn(
            "group flex items-center justify-between rounded-none px-3 py-2.5 text-sm font-medium transition-all",
            `pl-${depth * 4}`, item.badge && "pr-2",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Link
            href={item.href}
            className="flex items-center gap-3 flex-1"
            onClick={!hasChildren ? onClose : undefined}
          >
            <item.icon className={cn("h-4 w-4", isActive && "text-primary-foreground")} />
            <span>{item.name}</span>
          </Link>

          {item.badge && (
            <span className="ml-auto mr-2 rounded-none bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}

          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => toggleExpanded(item.name)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderNavigationItem(child, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
        collapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className={cn("flex grow flex-col gap-y-5 overflow-y-auto bg-background border-r border-border px-6 pb-4", {
          "px-0": collapsed
        })}>
          {/* Logo & Toggle */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            {!collapsed && (
              <Link href="/dash" className="flex items-center gap-2">
                <Logo className="h-7 w-auto" />
              </Link>
            )}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="rounded-none ml-auto"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronsRight className="h-5 w-5" />
                ) : (
                  <ChevronsLeft className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {dashboardNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-none text-sm font-medium transition-all",
                      collapsed ? "justify-center py-3" : "gap-x-3 px-3 py-2.5",
                      pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`))
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom Section */}
            {!collapsed && (
              <div className="mt-auto pt-4 border-t border-border space-y-2">
                {/* Upgrade Card */}
                <UpgradeCard />

                {/* Version */}
                <div className="text-center text-xs text-muted-foreground">
                  v{siteConfig.version}
                </div>
              </div>
            )}

            {/* Collapsed Upgrade Button */}
            {collapsed && profile?.data?.plan === "BASIC" && (
              <div className="mt-auto pt-4 border-t border-border">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-full h-12 rounded-none hover:bg-primary/10"
                  title="Upgrade to Pro"
                  onClick={() => setUpgradeOpen(true)}
                >
                  <Zap className="h-5 w-5 text-primary animate-pulse" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col transition-transform lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background border-r border-border px-6 pb-4">
          {/* Header with close button */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/dash" className="flex items-center gap-2">
              <Logo className="h-7 w-auto" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {dashboardNav.map((item) => renderNavigationItem(item))}
            </ul>

            {/* Bottom Section */}
            <div className="mt-auto pt-4 border-t border-border space-y-2">
              {/* Upgrade Card */}
              <UpgradeCard />

              {/* Version */}
              <div className="text-center text-xs text-muted-foreground">
                v{siteConfig.version}
              </div>
            </div>
          </nav>
        </div >
      </div >

      {/* Mobile overlay */}
      {
        isOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )
      }

      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        user={{
          name: profile?.data?.name,
          email: profile?.data?.email
        }}
      />
    </>
  )
}
