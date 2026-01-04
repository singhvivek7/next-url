"use client";

import { useEffect } from "react";

import { GridBackground } from "@/components/landing/background";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden mt-16">
            <GridBackground />
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
                    <h1 className="relative text-9xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-red-500 to-red-900/20">
                        500
                    </h1>
                </div>
                <h2 className="text-3xl font-bold mb-6">Something went wrong!</h2>
                <p className="text-muted-foreground max-w-md mb-8 text-lg">
                    We apologize for the inconvenience. An unexpected error occurred on our server.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" onClick={() => reset()} className="rounded-full px-8 h-12 text-base">
                        Try Again
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => window.location.href = "/"} className="rounded-full px-8 h-12 text-base">
                        Back to Home
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
