"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { env } from "@/config/env"
import { formateDate } from "@/lib/helper/date"
import { ILink } from "@/types/links.types"

import { LinkActions } from "./link-actions"

export const columns: ColumnDef<ILink>[] = [
    {
        id: "serialNumber",
        header: "S.No",
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            return (pageIndex * pageSize) + row.index + 1;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "original_url",
        header: "Original URL",
        cell: ({ row }) => {
            const url = row.getValue("original_url") as string
            return <div className="truncate max-w-[200px]" title={url}>{url}</div>
        }
    },
    {
        accessorKey: "short_url",
        header: "Short URL",
        cell: ({ row }) => {
            const url = row.getValue("short_url") as string
            return <div className="font-medium text-blue-600 dark:text-blue-400">{env.NEXT_PUBLIC_APP_BASE_URL}/{url}</div>
        }
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Clicks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-center">{row.original.clicks?.length || 0}</div>,
    },
    {
        accessorKey: "expires_at",
        header: "Expires At",
        cell: ({ row }) => {
            const expiresAt = row.getValue("expires_at") as string
            return expiresAt ? formateDate(expiresAt) : <span className="text-muted-foreground">-</span>
        }
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active")
            return (
                <div className={isActive ? "text-green-600" : "text-red-600"}>
                    {isActive ? "Active" : "Inactive"}
                </div>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => formateDate(row.getValue("created_at"))
    },
    {
        id: "actions",
        cell: ({ row }) => <LinkActions link={row.original} />,
    },
]
