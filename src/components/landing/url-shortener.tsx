"use client";

import {
    Copy,
    Link as LinkIcon,
    Trash2
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { handleShortUrl } from "@/actions/short-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import { getLocalStorage, setLocalStorage } from "@/lib/helper/storage";
import { copyToClipboard } from "@/utils/helper";

interface HistoryItem {
    id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: number;
}

export const UrlShortener = () => {
    const [currentUrl, setCurrentUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [isShortening, setIsShortening] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const savedHistory = getLocalStorage<HistoryItem[]>("urlHistory");
        if (savedHistory) {
            setHistory(savedHistory);
        }
    }, []);

    const saveToHistory = (original: string, short: string) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            originalUrl: original,
            shortUrl: short,
            createdAt: Date.now(),
        };
        const newHistory = [newItem, ...history].slice(0, 5); // Conserve space
        setHistory(newHistory);
        setLocalStorage("urlHistory", newHistory);
    };

    const deleteFromHistory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toast("Delete from history?", {
            action: {
                label: "Confirm",
                onClick: () => {
                    setHistory((current) => {
                        const newHistory = current.filter((item) => item.id !== id);
                        setLocalStorage("urlHistory", newHistory);
                        return newHistory;
                    });
                    toast.success("Entry removed");
                },
            },
            cancel: { label: "Cancel", onClick: () => { } },
        });
    };

    const handleCopy = useCallback(async (shortUrl: string) => {
        await copyToClipboard(shortUrl, {
            onSuccess: () => toast.success("Copied to clipboard"),
            onError: () => toast.error("Failed to copy")
        })
    }, []);

    const { data: profile } = useProfile({ retry: false });

    // ...

    const handleShortenUrl = useCallback(async () => {
        if (!currentUrl) {
            toast.error("Please enter a URL");
            return;
        }

        // Check anonymous limit
        if (!profile?.data && history.length >= 3) {
            toast.error("You have reached the free limit of 3 links.", {
                description: "Please login to create more links.",
                action: {
                    label: "Sign Up",
                    onClick: () => window.location.href = "/register"
                }
            });
            return;
        }

        try {
            new URL(currentUrl.startsWith("http") ? currentUrl : `https://${currentUrl}`);
        } catch {
            toast.error("Invalid URL format");
            return;
        }

        setIsShortening(true);
        try {
            const { data } = await handleShortUrl({ url: currentUrl });
            const short = `${window.location.origin}/${data.short_url}`;
            setShortenedUrl(short);
            saveToHistory(currentUrl, short);
            toast.success("Link generated");
        } catch (err: any) {
            toast.error(err.message || "Error processing request");
        }
        setIsShortening(false);
    }, [currentUrl, history, profile]);



    return (
        <div className="w-full">
            {/* Main Input Block - Sharp, Industrial, No-Round */}
            {/* Main Input Block - Sharp, Industrial, No-Round */}
            <div className="flex flex-col sm:flex-row items-stretch border border-border bg-card hover:border-ring transition-colors rounded-none overflow-hidden sm:overflow-visible">
                <div className="flex items-center justify-center px-5 py-4 sm:py-0 border-b sm:border-b-0 sm:border-r border-border text-muted-foreground bg-muted sm:bg-transparent">
                    <LinkIcon className="w-5 h-5" />
                </div>
                <Input
                    type="text"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShortenUrl()}
                    placeholder="paste.link/here"
                    className="flex-1 bg-transparent border-none text-foreground text-base sm:text-lg placeholder:text-muted-foreground/50 font-medium px-4 h-16 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-muted transition-colors min-h-16 sm:min-h-auto"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
                <Button
                    onClick={handleShortenUrl}
                    disabled={isShortening}
                    variant="default"
                    className="h-16 sm:h-auto rounded-none px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 border-t sm:border-t-0 sm:border-l border-border min-w-[120px] w-full sm:w-auto"
                >
                    {isShortening ? "Processing..." : "Shorten"}
                </Button>
            </div>

            {/* Results & History Stack */}
            <div className="mt-8 space-y-4">
                {/* Active Result Card */}
                <AnimatePresence>
                    {shortenedUrl && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-card border border-border p-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                                <a
                                    href={shortenedUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-mono text-primary hover:underline hover:text-primary/90 truncate text-lg"
                                >
                                    {shortenedUrl}
                                </a>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCopy(shortenedUrl)}
                                    className="p-2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* History List */}
                {history.length > 0 && (
                    <div className="border border-border divide-y divide-border">
                        <div className="bg-muted px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                            Recent Activity
                        </div>
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card hover:bg-muted transition-colors"
                            >
                                {/* Redirect URL - Left */}
                                <div className="sm:w-[30%] min-w-0">
                                    <div
                                        className="font-mono text-sm truncate cursor-pointer transition-colors group/link"
                                        onClick={() => handleCopy(item.shortUrl)}
                                    >
                                        <span className="text-muted-foreground group-hover/link:text-foreground/80 transition-colors">
                                            {item.shortUrl.replace(/^https?:\/\//, "").substring(0, item.shortUrl.replace(/^https?:\/\//, "").lastIndexOf("/") + 1)}
                                        </span>
                                        <span className="text-primary/80 font-semibold group-hover/link:text-primary transition-colors">
                                            {item.shortUrl.substring(item.shortUrl.lastIndexOf("/") + 1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Original URL - Center */}
                                <div className="sm:flex-1 w-full min-w-0 sm:text-center">
                                    <div className="text-xs text-muted-foreground truncate" title={item.originalUrl}>
                                        {item.originalUrl}
                                    </div>
                                </div>

                                {/* Actions - Right */}
                                <div className="flex items-center justify-end gap-2 sm:w-[20%] opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleCopy(item.shortUrl)}
                                        className="cursor-pointer p-2 border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
                                        title="Copy Link"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => deleteFromHistory(item.id, e)}
                                        className="cursor-pointer p-2 border border-border hover:border-red-500/30 text-muted-foreground hover:text-destructive transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
