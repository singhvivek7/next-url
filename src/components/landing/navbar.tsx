"use client";

import { ChevronRight, Menu, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogin = () => router.push("/login");

    const navLinks = siteConfig.nav;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 transition-all duration-300">
            <div className="w-full h-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">

                {/* Left: Logo & Context */}
                <div className="flex items-center gap-8">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push("/")}
                    >
                        <div className="flex items-center justify-center group-hover:scale-95 transition-transform duration-200">
                            <Logo className="h-8 w-auto" />
                        </div>
                        <span className="sr-only">{siteConfig.name}</span>
                        <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 border border-border bg-muted text-[10px] text-muted-foreground font-mono">
                            <Sparkles className="w-2.5 h-2.5 text-primary/80" />
                            <span>{siteConfig.version}</span>
                        </div>
                    </div>

                    {/* Desktop Links (Linear, Clean) */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((item) => (
                            <a
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className="cursor-pointer text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-200"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <ThemePicker />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="hidden sm:block relative group"
                    >
                        {/* Animated gradient border */}
                        <div className="absolute -inset-[2px] bg-linear-to-r from-primary via-secondary to-primary bg-[length:200%_100%] rounded-none animate-gradient-x opacity-75 group-hover:opacity-100 transition-opacity" />

                        {/* Sparkle effects */}
                        <div className="absolute -inset-[2px] rounded-none overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleLogin}
                            className="relative flex gap-2 group/btn"
                        >
                            <Sparkles className="w-3.5 h-3.5 transition-colors" />
                            <span>Start for Free</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-all" />
                        </Button>
                    </motion.div>
                    <button
                        className="md:hidden p-1 text-foreground/70 hover:text-foreground transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-16 left-0 right-0 border-b border-border bg-background"
                    >
                        <div className="p-4 space-y-1">
                            {navLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block px-4 py-3 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted rounded-none transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="h-px bg-border my-2 mx-4" />
                            <a
                                href="/login"
                                className="block px-4 py-3 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted rounded-none transition-colors"
                            >
                                Log in
                            </a>
                            <Button
                                onClick={handleLogin}
                                className="w-full justify-start px-4 py-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-none transition-colors mt-2"
                            >
                                Get Access
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
