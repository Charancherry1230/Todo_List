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

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error?.formErrors?.[0] || "Failed to sign up");
                return;
            }

            toast.success("Account created successfully!");
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-8 relative overflow-hidden">

                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/30 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/30 blur-3xl rounded-full"></div>

                    <div className="relative z-10">
                        <div className="flex justify-center mb-8">
                            <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 p-3 rounded-2xl text-white shadow-lg shadow-pink-500/30">
                                <CheckSquare className="h-8 w-8" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold tracking-tight mb-2">Create an Account</h1>
                            <p className="text-muted-foreground text-sm">Join TaskFlow and supercharge your team</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium ml-1">Full Name</label>
                                <Input
                                    {...register("name")}
                                    type="text"
                                    placeholder="John Doe"
                                    className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && <p className="text-xs text-red-500 ml-1 mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium ml-1">Email</label>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium ml-1">Password</label>
                                <Input
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/25 transition-all duration-300 border-0"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isLoading ? "Creating account..." : "Sign Up"}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline transition-all">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
