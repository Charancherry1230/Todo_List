"use client";

import { Moon, Sun, CheckSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/Button";

export function Navbar() {
    const { theme, setTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <CheckSquare className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="rounded-full"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
