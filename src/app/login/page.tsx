"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, CheckSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error?.formErrors?.[0] || "Failed to login");
                return;
            }

            toast.success("Welcome back!");
            router.push("/");
            router.refresh();
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 dark:from-indigo-950/50 dark:via-purple-900/20 dark:to-pink-950/30 p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-8 relative overflow-hidden">

                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/30 blur-3xl rounded-full"></div>

                    <div className="relative z-10">
                        <div className="flex justify-center mb-8">
                            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-3 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                                <CheckSquare className="h-8 w-8" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
                            <p className="text-muted-foreground text-sm">Sign in to continue to TaskFlow</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Email</label>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 ${errors.email ? 'border-red-500 outline-red-500' : ''}`}
                                />
                                {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Password</label>
                                <Input
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 ${errors.password ? 'border-red-500 outline-red-500' : ''}`}
                                />
                                {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isLoading ? "Signing in..." : "Sign In"}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <p className="text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-all">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
