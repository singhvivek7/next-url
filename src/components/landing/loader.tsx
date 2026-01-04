"use client";

import { motion } from "motion/react";

export const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground">
            <div className="relative">
                <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.2, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="mt-8 flex flex-col items-center gap-2 overflow-hidden">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold tracking-wider"
                >
                    NEXT<span className="text-primary">URL</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-muted-foreground"
                >
                    Loading...
                </motion.p>
            </div>

            <motion.div
                className="absolute bottom-20 w-48 h-1 bg-muted rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    className="h-full bg-primary"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </div>
    );
};
