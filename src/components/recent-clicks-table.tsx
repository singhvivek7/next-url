"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Globe } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/helper/date"

interface Click {
    id: string
    city: string | null
    country: string | null
    device: string | null
    browser: string | null
    os: string | null
    ip_address: string | null
    created_at: string
}

const columns: ColumnDef<Click>[] = [
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            const city = row.original.city || "Unknown";
            const country = row.original.country || "Unknown";
            return (
                <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-[120px]" title={`${city}, ${country}`}>
                        {city}, {country}
                    </span>
                </div>
            )
        }
    },
    {
        header: "Device / OS",
        cell: ({ row }) => (
            <div className="flex flex-col text-xs">
                <span>{row.original.device || "Unknown"}</span>
                <span className="text-muted-foreground whitespace-nowrap">{row.original.os || "?"} • {row.original.browser || "?"}</span>
            </div>
        )
    },
    {
        accessorKey: "ip_address",
        header: "IP",
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ip_address}</span>
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(row.original.created_at)}</span>
    }
]

export function RecentClicksTable({ data }: { data: Click[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-none border border-border overflow-hidden">
            <div className="max-h-[calc(100vh-300px)] min-h-[300px] overflow-y-auto">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-xs uppercase font-medium h-9">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/30"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No recent clicks recorded.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
