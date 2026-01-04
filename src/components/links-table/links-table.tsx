"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useLinks } from "@/hooks/use-links"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export function LinksTable() {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const limit = 10

    const { data: linksData, isLoading, isError, error } = useLinks(page, limit)

    if (isLoading) {
        // Render a skeleton or loading state using DataTable structure to prevent layout shift if possible, 
        // or just the spinner as before.
        return <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>
    }

    if (isError) {
        return <div className="text-red-500 text-center p-10">Error loading links: {(error as Error).message}</div>
    }

    // linksData matches ILinks interface
    const data = linksData?.data || []
    const meta = linksData?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 }

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-bold mb-4">Your Links</h2>
            <DataTable
                columns={columns}
                data={data}
                pageCount={meta.totalPages}
                pageIndex={meta.page}
                pageSize={meta.limit}
                onPageChange={setPage}
                onRowClick={(row) => router.push(`/links/${row.id}`)}
            />
        </div>
    )
}
