"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";

import { siteConfig } from "@/config/site";

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-background border-b border-border">
            <div className="max-w-[800px] mx-auto px-6">
                <h2 className="text-2xl font-bold text-foreground mb-12">Frequently asked questions</h2>
                <div className="flex flex-col border-t border-border">
                    {siteConfig.faq.map((item, i) => (
                        <div key={i} className="border-b border-border">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full py-6 flex items-center justify-between text-left group"
                            >
                                <span className={`text-sm font-medium transition-colors ${openIndex === i ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    {item.q}
                                </span>
                                <Plus
                                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-6 text-sm text-muted-foreground leading-relaxed max-w-xl">
                                            {item.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
