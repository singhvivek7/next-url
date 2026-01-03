"use client";

import { motion } from "motion/react";

const stats = [
    { value: "10M+", label: "Requests/Day" },
    { value: "50ms", label: "Global Latency" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "24/7", label: "Expert Support" },
];

export const Stats = () => {
    return (
        <section className="border-b border-border bg-background">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background px-8 py-12 md:py-16 text-center group hover:bg-muted transition-colors"
                        >
                            <div className="text-3xl md:text-4xl font-mono font-medium text-foreground group-hover:text-primary mb-2 tracking-tighter transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
