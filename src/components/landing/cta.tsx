"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { siteConfig } from "@/config/site";

export const CTA = () => {
    return (
        <section className="py-32 bg-background">
            <div className="max-w-[1400px] mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-8">
                        {siteConfig.cta.title}
                    </h2>
                    <p className="text-xl text-muted-foreground mb-10">
                        {siteConfig.cta.description}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="default" size="xl" className="font-semibold text-sm">
                            {siteConfig.cta.primaryButton}
                        </Button>
                        <Button variant="landing-ghost" size="xl" className="font-medium text-sm gap-2">
                            {siteConfig.cta.secondaryButton} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
