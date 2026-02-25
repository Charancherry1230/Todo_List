"use client";

import { Moon, Sun, CheckSquare, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";

interface NavbarProps {
    user?: {
        name: string;
        email: string;
    } | null;
}

export function Navbar({ user }: NavbarProps) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg text-white shadow-md shadow-indigo-500/20">
                            <CheckSquare className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            TaskFlow
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="rounded-full hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {user && (
                            <div className="flex items-center gap-3 pl-4 border-l">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Logout</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
