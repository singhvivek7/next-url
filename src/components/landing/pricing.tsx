"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const Pricing = () => {
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
                    {siteConfig.pricing.map((plan) => (
                        <div key={plan.name} className={`p-8 bg-background flex flex-col h-full ${plan.highlighted ? "relative overflow-hidden group" : ""}`}>
                            {plan.highlighted && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary ml-0 transition-all duration-300" />
                            )}

                            <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                            <div className="text-3xl font-bold text-foreground mb-6">
                                {plan.price}
                                {plan.period && <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-8 border-b border-border pb-8">
                                {plan.description}
                            </p>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className={`flex items-center gap-3 text-sm ${plan.highlighted ? "text-foreground" : "text-muted-foreground"}`}>
                                        <Check className={`w-4 h-4 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant={plan.highlighted ? "default" : "landing-outline"}
                                size="lg"
                                className="w-full mt-auto"
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
