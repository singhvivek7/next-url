"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  Link2,
  MousePointerClick,
  QrCode,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dash", icon: Home },
  { name: "My Links", href: "/links", icon: Link2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "QR Codes", href: "/qr-codes", icon: QrCode },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    children: [
      {
        name: "Click Reports",
        href: "/reports/clicks",
        icon: MousePointerClick,
      },
      { name: "Traffic Reports", href: "/reports/traffic", icon: BarChart3 },
      { name: "Geographic Reports", href: "/reports/geographic", icon: Users },
    ],
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.name}>
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            level > 0 && "ml-4",
            isActive
              ? "bg-muted text-foreground font-semibold"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <Link
            href={item.href}
            className="flex items-center gap-3 flex-1"
            onClick={!hasChildren ? onClose : undefined}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>

          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0"
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
              renderNavigationItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background border-r border-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Link2 className="text-primary w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-foreground">Dashboard</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => renderNavigationItem(item))}
            </ul>
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
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Link2 className="text-primary w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-foreground">Dashboard</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => renderNavigationItem(item))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
