"use client";

import { GridBackground } from "@/components/landing/background";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

interface PolicyLayoutProps {
    children: React.ReactNode;
    title: string;
    lastUpdated: string;
}

export const PolicyLayout = ({ children, title, lastUpdated }: PolicyLayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <GridBackground />
            <Navbar />

            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-12 border-b border-border pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                        {title}
                    </h1>
                    <p className="text-muted-foreground">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                <div className="space-y-8 text-foreground/80 leading-relaxed">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};
