"use client"

import { Check, CreditCard } from "lucide-react"
import { useState } from "react"

import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog"
import { GeneralLoader } from '@/components/general-loader';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfile } from "@/hooks/use-profile"

export function PlanTab() {
    const { data: profile, isLoading } = useProfile()
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

    if (isLoading) return <GeneralLoader />

    const plan = profile?.data?.plan || "BASIC"
    const details = profile?.data?.plan_details

    const currentDetails = {
        name: details?.name || "Basic Plan",
        price: details ? (details.price === 0 ? "Free" : `${details.currency} ${details.price}`) : "Free",
        features: details?.features || ["Shorten links", "Basic analytics"],
        limit: details?.limits || {}
    }

    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-none p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Subscription Plan</h2>
                        <p className="text-muted-foreground">Manage your billing and subscription</p>
                    </div>
                    <Badge className="text-base px-4 py-1 rounded-none uppercase" variant="secondary">{plan}</Badge>
                </div>

                <Card className="rounded-none border-primary/20 shadow-sm bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{currentDetails.name}</span>
                            <span className="text-2xl font-bold">{currentDetails.price}</span>
                        </CardTitle>
                        <CardDescription>
                            Current active plan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="text-sm font-medium mb-3">Included Features:</div>
                            <ul className="grid gap-2">
                                {currentDetails.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {currentDetails.limit && Object.keys(currentDetails.limit).length > 0 && (
                            <div className="pt-4 border-t border-border">
                                <div className="text-sm font-medium mb-3">Usage Limits:</div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(currentDetails.limit).map(([key, val]) => (
                                        <div key={key} className="p-3 bg-muted/20 border border-border rounded-none">
                                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{key}</div>
                                            <div className="font-mono text-sm font-semibold">{String(val)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full sm:w-auto rounded-none"
                            onClick={() => setUpgradeDialogOpen(true)}
                        >
                            Upgrade Plan
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="bg-card border border-border rounded-none p-6">
                <h3 className="text-lg font-semibold mb-4">Billing Method</h3>
                <div className="flex items-center justify-between p-4 border rounded-none bg-muted/40">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">No payment method added</p>
                            <p className="text-xs text-muted-foreground">Add a card to upgrade to Pro</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-none">Add Method</Button>
                </div>
            </div>

            <UpgradeDialog
                open={upgradeDialogOpen}
                onOpenChange={setUpgradeDialogOpen}
                currentPlan={profile?.data?.plan}
                user={{
                    name: profile?.data?.name,
                    email: profile?.data?.email
                }}
            />
        </div>
    )
}
