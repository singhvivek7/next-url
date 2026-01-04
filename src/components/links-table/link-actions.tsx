"use client"

import { Copy, Info, Lock, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { env } from "@/config/env"
import { useDeleteLink } from "@/hooks/use-delete-link"
import { useLinkById } from "@/hooks/use-link-by-id"
import { useUpdateLink } from "@/hooks/use-update-link"
import { formatDate } from "@/lib/helper/date"
import { ILink } from "@/types/links.types"
import { copyToClipboard } from "@/utils/helper"

interface LinkActionsProps {
    link: ILink
}

export function LinkActions({ link }: LinkActionsProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const shortUrl = `${env.NEXT_PUBLIC_APP_BASE_URL}/${link.short_url}`

    const deleteLink = useDeleteLink()
    const updateLink = useUpdateLink()

    // Only fetch when dialog is open to avoid excessive API calls
    const { data: linkDetails } = useLinkById(link.id, {}, { enabled: isDetailsOpen })

    // We can use the props link as initial data or fallback
    const displayLink = linkDetails?.data || link

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-none">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => setIsDetailsOpen(true)}
                        className="cursor-pointer rounded-none"
                    >
                        <Info className="mr-2 h-4 w-4" /> <span>Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => copyToClipboard(shortUrl, {
                            onSuccess: () => toast.success("Copied to clipboard"),
                            onError: () => toast.error("Failed to copy")
                        })}
                        className="cursor-pointer rounded-none"
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            updateLink.mutate({ id: link.id, data: { is_active: !link.is_active } })
                        }}
                        className="cursor-pointer rounded-none"
                    >
                        {link.is_active ? (<><Lock className="mr-2 h-4 w-4" /><span>Disable</span></>) : (<><Lock className="mr-2 h-4 w-4" /><span>Enable</span></>)}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsDeleteOpen(true)
                        }}
                        className="cursor-pointer rounded-none"
                    >
                        {link.is_active ? (<><Trash className="mr-2 h-4 w-4" /><span>Delete</span></>) : (<><Trash className="mr-2 h-4 w-4" /><span>Delete</span></>)}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Link Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about your short link.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium text-right text-sm text-muted-foreground">Original:</span>
                            <div className="col-span-3 truncate text-sm" title={displayLink.original_url}>
                                <a href={displayLink.original_url} target="_blank" rel="noreferrer" className="hover:underline">
                                    {displayLink.original_url}
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium text-right text-sm text-muted-foreground">Short URL:</span>
                            <div className="col-span-3 flex items-center gap-2">
                                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    {env.NEXT_PUBLIC_APP_BASE_URL}/{displayLink.short_url}
                                </a>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(shortUrl, {
                                    onSuccess: () => toast.success("Copied to clipboard"),
                                    onError: () => toast.error("Failed to copy")
                                })}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium text-right text-sm text-muted-foreground">Status:</span>
                            <div className={`col-span-3 text-sm font-medium ${displayLink.is_active ? "text-green-600" : "text-red-600"}`}>
                                {displayLink.is_active ? "Active" : "Inactive"}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium text-right text-sm text-muted-foreground">Clicks:</span>
                            <div className="col-span-3 text-sm">
                                {displayLink?._count?.clicks || 0}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium text-right text-sm text-muted-foreground">Created:</span>
                            <div className="col-span-3 text-sm">
                                {formatDate(displayLink.created_at)}
                            </div>
                        </div>
                        {displayLink.expires_at && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium text-right text-sm text-muted-foreground">Expires:</span>
                                <div className="col-span-3 text-sm">
                                    {formatDate(displayLink.expires_at)}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this link? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                deleteLink.mutate(link.id)
                                setIsDeleteOpen(false)
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
