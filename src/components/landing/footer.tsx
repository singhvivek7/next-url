"use client";

import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";

export const Footer = () => {
    return (
        <footer className="py-20 bg-background border-t border-border text-sm">
            <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Logo className="h-8 w-auto" />
                    </div>
                </div>

                {[
                    {
                        title: "Product", items: [
                            { name: "Features", href: "#features" },
                            { name: "Pricing", href: "#pricing" },
                            { name: "API", href: "#" },
                            { name: "Changelog", href: "#" }
                        ]
                    },
                    {
                        title: "Company", items: [
                            { name: "About", href: "#" },
                            { name: "Blog", href: "#" },
                            { name: "Careers", href: "#" },
                            { name: "Contact", href: "#" }
                        ]
                    },
                    {
                        title: "Legal", items: [
                            { name: "Privacy", href: "/privacy" },
                            { name: "Terms", href: "/terms" },
                            { name: "Security", href: "#" }
                        ]
                    },
                ].map((col) => (
                    <div key={col.title}>
                        <h4 className="font-semibold text-foreground mb-6">{col.title}</h4>
                        <ul className="space-y-4">
                            {col.items.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mt-20 pt-8 border-t border-border flex items-center justify-between text-muted-foreground/60 text-xs">
                <p>© {new Date().getFullYear()}</p>
                <div className="flex gap-4">
                    <span>System Status: Operational</span>
                    <span>v{siteConfig.version}</span>
                </div>
            </div>
        </footer>
    );
};
