"use client";

import { motion } from "motion/react";
import { Copy, Check, ArrowRight, Link as LinkIcon, Activity } from "lucide-react";
import { UrlShortener } from "./url-shortener";
import { siteConfig } from "@/config/site";
import { RotatingText } from "./rotating-text";

// ... inside Hero component ...

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 px-6 md:pt-48 md:pb-32 border-b border-border bg-background">
            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col items-center text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 px-3 py-1 border border-border bg-muted mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                        <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                            {siteConfig.hero.badge}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-8"
                    >
                        {siteConfig.hero.titlePrefix}
                        <br />
                        <RotatingText
                            words={siteConfig.hero.rotatingWords}
                            className="text-primary"
                        />
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed whitespace-pre-line"
                    >
                        {siteConfig.hero.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-full max-w-2xl"
                    >
                        <UrlShortener />
                    </motion.div>

                    {/* Trusted By - Minimal text only */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-24 pt-8 border-t border-border w-full max-w-3xl"
                    >
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono mb-6">
                            Powering links for
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                            {siteConfig.hero.trustedBy.map((company) => (
                                <span
                                    key={company}
                                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-default tracking-wide"
                                >
                                    {company}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Technical Grid Background (Overlay) */}
            <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />
        </section>
    );
};
