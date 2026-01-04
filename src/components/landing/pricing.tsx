"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import { GeneralLoader } from "@/components/general-loader";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/use-plans";
import { formatPrice } from "@/lib/helper/date";

export const Pricing = () => {
    const { data: plans, isLoading, error } = usePlans();
    const router = useRouter();
    const handleOnClick = () => {
        router.push("/login");
    };

    if (isLoading) {
        return (
            <section id="pricing" className="py-24 bg-background border-b border-border">
                <div className="max-w-[1400px] mx-auto px-6">
                    <GeneralLoader
                        title="Loading Plans"
                        description="Fetching pricing information..."
                    />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="pricing" className="py-24 bg-background border-b border-border">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-none p-6 text-center">
                        <p className="text-destructive font-medium">Failed to load pricing plans</p>
                        <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing" className="py-24 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16 md:mb-24"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                        Transparent pricing.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl">
                        Scale your link infrastructure with plans designed for every stage of growth.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-px md:bg-border lg:border lg:border-border">
                    {plans?.map((plan) => {
                        const highlighted = plan.type === "PRO";
                        const isCustom = plan.type === "CUSTOM";

                        return (
                            <div key={plan.id} className={`p-8 bg-background flex flex-col h-full ${highlighted ? "relative overflow-hidden group" : ""}`}>
                                {highlighted && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary ml-0 transition-all duration-300" />
                                )}

                                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                                <div className="text-3xl font-bold text-foreground mb-6">
                                    {formatPrice(plan.price)}
                                    <span className="text-sm font-normal text-muted-foreground">/mo</span>

                                </div>
                                <p className="text-sm text-muted-foreground mb-8 border-b border-border pb-8">
                                    {plan.description}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className={`flex items-center gap-3 text-sm ${highlighted ? "text-foreground" : "text-muted-foreground"}`}>
                                            <Check className={`w-4 h-4 ${highlighted ? "text-primary" : "text-muted-foreground"}`} /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={highlighted ? "default" : "landing-outline"}
                                    size="lg"
                                    className="w-full mt-auto"
                                    onClick={handleOnClick}
                                >
                                    {isCustom ? "Contact Sales" : plan.type === "BASIC" ? "Start for free" : "Get Started"}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
