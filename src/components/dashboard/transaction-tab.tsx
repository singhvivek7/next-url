"use client"

import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTransactions } from "@/hooks/use-transactions"

export function TransactionTab() {
    const { data, isLoading } = useTransactions()
    const transactions = data?.data || []

    if (isLoading) {
        return (
            <div className="flex justify-center p-12 border border-border bg-card">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="bg-card border border-border rounded-none shadow-sm">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <p className="text-sm text-muted-foreground">View your recent payments and invoices</p>
            </div>
            {transactions.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                    No transactions found
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6">Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Invoice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((txn: any) => (
                            <TableRow key={txn.id}>
                                <TableCell className="pl-6">
                                    {new Date(txn.created_at).toLocaleDateString("en-IN", {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {txn.plan_type} Plan Subscription
                                </TableCell>
                                <TableCell>{txn.currency} {txn.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={txn.status === 'SUCCESS' ? 'default' : 'secondary'} className="rounded-none">
                                        {txn.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <span className="text-xs text-muted-foreground cursor-not-allowed">Download</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
