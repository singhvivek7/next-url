"use client";

import * as React from "react";
import { Paintbrush, Moon, Sun } from "lucide-react";

import { useThemeColor } from "@/components/config-style-provider";
import { colorPalettes } from "@/config/color-palettes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function ThemePicker() {
    const { palette, setPalette, mode, setMode } = useThemeColor();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="landing-ghost" size="icon" className="w-9 h-9">
                    <Paintbrush className="h-4 w-4" />
                    <span className="sr-only">Change Theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-border bg-background min-w-[200px]">
                <DropdownMenuLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Color Palette
                </DropdownMenuLabel>
                {Object.values(colorPalettes).map((p) => (
                    <DropdownMenuItem
                        key={p.name}
                        onClick={() => setPalette(p.name)}
                        className="rounded-none cursor-pointer focus:bg-muted focus:text-foreground"
                    >
                        <div className="flex items-center gap-2 w-full">
                            <div
                                className="h-3 w-3 rounded-none ring-1 ring-border"
                                style={{ backgroundColor: p.cssVars.primary }}
                            />
                            <span className={palette.name === p.name ? "text-foreground font-medium" : "text-muted-foreground"}>
                                {p.label}
                            </span>
                        </div>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuLabel className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Appearance
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => setMode("light")}
                    className="rounded-none cursor-pointer focus:bg-muted focus:text-foreground"
                >
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span className={mode === "light" ? "text-foreground font-medium" : "text-muted-foreground"}>
                            Light
                        </span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setMode("dark")}
                    className="rounded-none cursor-pointer focus:bg-muted focus:text-foreground"
                >
                    <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span className={mode === "dark" ? "text-foreground font-medium" : "text-muted-foreground"}>
                            Dark
                        </span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
