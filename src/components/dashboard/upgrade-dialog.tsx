
"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useThemeColor } from "@/components/config-style-provider";
import { GeneralLoader } from "@/components/general-loader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/config/env";
import { usePlans } from "@/hooks/use-plans";
import { useProfile } from "@/hooks/use-profile";
import { UPGRADE_GRADIENT_STYLES } from "@/lib/constant/ui.constant";
import { formatPrice } from "@/lib/helper/date";
import { hslToHex } from "@/utils/color";

interface UpgradeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentPlan?: string; // User's current plan type
    user?: {
        name?: string;
        email?: string;
    };
}

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const { data: plans, isLoading: plansLoading } = usePlans();
    const { data: user } = useProfile();
    const { palette } = useThemeColor();

    // Filter out current plan and get available plans
    const availablePlans = plans?.filter(p => p.type !== user?.data.plan_details?.type) || [];

    // Auto-select first available plan
    const activePlan = selectedPlan
        ? availablePlans.find(p => p.id === selectedPlan)
        : availablePlans[0];

    // Get theme color in hex format for Razorpay
    const themeColor = hslToHex(palette.cssVars.primary);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!activePlan) {
            toast.error("Please select a plan");
            return;
        }

        // For Enterprise/Custom plans, show contact message
        if (activePlan.type === "CUSTOM") {
            toast.info("Enterprise Plan", {
                description: "Please contact our sales team for custom pricing and enterprise features."
            });
            return;
        }

        setLoading(true);

        // 1. Load Script
        const res = await loadRazorpayScript();
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
        }

        // 2. Create Order
        try {
            const orderRes = await fetch("/api/v1/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: activePlan.price,
                    currency: activePlan.currency,
                    plan_type: activePlan.type
                }),
            });

            if (!orderRes.ok) throw new Error("Failed to create order");

            const orderData = await orderRes.json();

            // 3. Open Razorpay Options
            const options = {
                key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: `NextLink ${activePlan.name}`,
                description: `Upgrade to ${activePlan.name}`,
                image: "/logo/light.svg",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // 4. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/v1/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        if (verifyRes.ok) {
                            toast.success("Upgrade Successful!", {
                                description: `You are now on the ${activePlan.name}.`
                            });
                            onOpenChange(false);
                            window.location.reload();
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.data?.name || "",
                    email: user?.data?.email || "",
                    contact: ""
                },
                theme: {
                    color: themeColor,
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upgrade Your Plan</DialogTitle>
                    <DialogDescription>
                        Choose a plan that fits your needs
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 max-h-[60vh] overflow-y-auto">{plansLoading ? (
                    <GeneralLoader title="Loading Plans" description="Please wait..." />
                ) : availablePlans.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No upgrade options available
                    </div>
                ) : (
                    <div className="space-y-4">
                        {availablePlans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`border rounded-none p-4 cursor-pointer transition-all ${(selectedPlan === plan.id || (!selectedPlan && plan.id === availablePlans[0]?.id))
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                                        {plan.description && (
                                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            {formatPrice(plan.price)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">/month</div>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {plan.limits && (
                                    <div className="mt-3 pt-3 border-t border-border/50 flex gap-4 text-xs text-muted-foreground">
                                        <span>URLs: {plan.limits.urls === -1 ? <span className="font-semibold text-primary">Unlimited</span> : plan.limits.urls}</span>
                                        <span>Clicks: {plan.limits.clicks === -1 ? <span className="font-semibold text-primary">Unlimited</span> : plan.limits.clicks}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePayment}
                        disabled={loading || !activePlan}
                        className={`${UPGRADE_GRADIENT_STYLES} border-0 hover:opacity-90`}
                    >
                        {loading
                            ? "Processing..."
                            : activePlan?.type === "CUSTOM"
                                ? "Contact Sales"
                                : `Upgrade to ${activePlan?.name || 'Plan'}`
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
