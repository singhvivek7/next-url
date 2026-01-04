"use client";

import Link from "next/link";

import { GridBackground } from "@/components/landing/background";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden mt-16">
            <GridBackground />
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <h1 className="relative text-9xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/20">
                        404
                    </h1>
                </div>
                <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
                <p className="text-muted-foreground max-w-md mb-8 text-lg">
                    Oops! The destination you are looking for doesn't exist or has been moved.
                </p>
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8 h-12 text-base">
                        Back to Homepage
                    </Button>
                </Link>
            </main>

            <Footer />
        </div>
    );
}
