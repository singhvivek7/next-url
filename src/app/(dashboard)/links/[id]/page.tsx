"use client";

import { ArrowLeft, BarChart2, Calendar, Clock, Copy, Lock, Trash, Unlock } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";

import { DatePickerWithRange } from "@/components/date-range-picker";
import { GeneralLoader } from "@/components/general-loader";
import { RecentClicksTable } from "@/components/recent-clicks-table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteLink } from "@/hooks/use-delete-link";
import { useLinkById } from "@/hooks/use-link-by-id";
import { useUpdateLink } from "@/hooks/use-update-link";
import { formatDate } from "@/lib/helper/date";
import { copyToClipboard } from "@/utils/helper";

export default function LinkDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const defaultDateRange = {
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date()
    };
    const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);
    const [appliedRange, setAppliedRange] = useState<DateRange | undefined>(defaultDateRange);

    const queryParams = {
        start: appliedRange?.from ? appliedRange.from.toISOString() : undefined,
        end: appliedRange?.to ? appliedRange.to.toISOString() : undefined
    };

    const handleApply = () => {
        setAppliedRange(dateRange);
    };

    const { data, isLoading } = useLinkById(id as string, queryParams);
    const deleteLink = useDeleteLink();
    const updateLink = useUpdateLink();

    if (isLoading) {
        return <GeneralLoader />;
    }

    const link = data?.data;

    if (!link) {
        return notFound();
    }

    const handleDelete = () => {
        deleteLink.mutate(link.id, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                router.push("/links");
            },
        });
    };

    const handleStatusChange = () => {
        updateLink.mutate(
            { id: link.id, data: { is_active: !link.is_active } },
            {
                onSuccess: () => {
                    setIsStatusOpen(false);
                },
            }
        );
    };

    const handleCopy = () => {
        const fullShortUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${link.short_url}`;
        copyToClipboard(fullShortUrl, {
            onSuccess: () => toast.success("Copied to clipboard"),
            onError: () => toast.error("Failed to copy"),
        });
    };

    return (
        <div className="container mx-auto w-full">
            <Link href="/links" className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Links
            </Link>

            <div className="grid gap-6 lg:grid-cols-2 items-start">
                <div className="space-y-6">
                    {/* Main Details Card */}
                    <div className="bg-card border border-border p-6 rounded-none shadow-sm">

                        {/* Header with Actions */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold break-all mb-2">{link.title || "Untitled Link"}</h1>
                                    <div className="flex items-center gap-3">
                                        <a href={process.env.NEXT_PUBLIC_APP_BASE_URL + "/" + link.short_url} target="_blank" className="text-primary hover:underline text-lg font-medium">
                                            /{link.short_url}
                                        </a>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={handleCopy}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <span className={`px-2 py-1 rounded text-xs font-medium text-primary bg-primary/10`}>
                                            {link.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                {link.is_active ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                                {link.is_active ? "Disable" : "Enable"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Confirm {link.is_active ? "Disable" : "Enable"}</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to {link.is_active ? "disable" : "enable"} this link?
                                                    {link.is_active ? " Users will be redirected to a 404 page when accessing it." : " The link will become accessible immediately."}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsStatusOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleStatusChange} disabled={updateLink.isPending}>
                                                    {updateLink.isPending ? "Updating..." : "Confirm"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="default" size="sm">
                                                <Trash className="w-4 h-4 mr-2" /> Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
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
                                                <Button variant="default" onClick={handleDelete} disabled={deleteLink.isPending}>
                                                    {deleteLink.isPending ? "Deleting..." : "Delete"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-none">
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Original Destination</span>
                                <div className="flex items-center gap-2 justify-between">
                                    <span className="truncate text-sm font-mono flex-1" title={link.original_url}>{link.original_url}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-muted/50 rounded-none">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                        <BarChart2 className="w-3 h-3" />
                                        <span className="text-xs uppercase">Total Clicks</span>
                                    </div>
                                    <p className="font-medium text-sm">{link?._count?.clicks ?? 0}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-none">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-xs uppercase">Created</span>
                                    </div>
                                    <p className="font-medium text-sm">{formatDate(link.created_at)}</p>
                                </div>

                                <div className="p-3 bg-muted/50 rounded-none">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs uppercase">Expires</span>
                                    </div>
                                    <p className="font-medium text-sm">
                                        {link.expires_at ? formatDate(link.expires_at) : "Never"}
                                    </p>
                                </div>
                            </div>

                            {link.description && (
                                <div className="p-3 bg-muted/50 rounded-none">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">Description</span>
                                    <p className="text-sm">{link.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analytics Snapshot */}
                    <div className="bg-card border border-border p-6 rounded-none shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Activity</h3>
                            <div className="flex items-center gap-2">
                                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                                <Button size="sm" onClick={handleApply}>Apply</Button>
                            </div>
                        </div>

                        <div className="h-[300px] w-full mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={link.graph || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--muted-foreground)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' })}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1 }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="var(--primary)"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: "var(--primary)" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">Top Locations</h4>
                                <div className="space-y-2">
                                    {link.locations?.length ? link.locations.map((item: any) => (
                                        <div key={item._id} className="flex items-center justify-between text-sm p-2 bg-muted/40 rounded">
                                            <span className="truncate max-w-[120px]" title={item._id}>{item._id || "Unknown"}</span>
                                            <span className="font-mono text-muted-foreground">{item.count}</span>
                                        </div>
                                    )) : <p className="text-xs text-muted-foreground">No data</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">Top Devices</h4>
                                <div className="space-y-2">
                                    {link.devices?.length ? link.devices.map((item: any) => (
                                        <div key={item._id} className="flex items-center justify-between text-sm p-2 bg-muted/40 rounded">
                                            <span className="truncate max-w-[120px]" title={item._id}>{item._id || "Unknown"}</span>
                                            <span className="font-mono text-muted-foreground">{item.count}</span>
                                        </div>
                                    )) : <p className="text-xs text-muted-foreground">No data</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">Top OS</h4>
                                <div className="space-y-2">
                                    {link.os?.length ? link.os.map((item: any) => (
                                        <div key={item._id} className="flex items-center justify-between text-sm p-2 bg-muted/40 rounded-none">
                                            <span className="truncate max-w-[120px]" title={item._id}>{item._id || "Unknown"}</span>
                                            <span className="font-mono text-muted-foreground">{item.count}</span>
                                        </div>
                                    )) : <p className="text-xs text-muted-foreground">No data</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-card border border-border p-6 rounded-none shadow-sm sticky top-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Clicks</h3>

                        <RecentClicksTable data={link.click || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
