"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    category: z.string().min(1, "Category is required"),
    status: z.enum(["PENDING", "COMPLETED"]).optional()
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    isLoading?: boolean;
}

export function TaskFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }: TaskFormModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: "MEDIUM",
            status: "PENDING",
            category: "Work",
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    title: initialData.title,
                    description: initialData.description || "",
                    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
                    priority: initialData.priority || "MEDIUM",
                    category: initialData.category || "Work",
                    status: initialData.status || "PENDING",
                });
            } else {
                reset({
                    title: "",
                    description: "",
                    dueDate: "",
                    priority: "MEDIUM",
                    category: "Work",
                    status: "PENDING",
                });
            }
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-50 w-full max-w-lg rounded-3xl bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        {initialData ? "Edit Task" : "Create New Task"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Title <span className="text-destructive">*</span></label>
                        <Input
                            {...register("title")}
                            placeholder="e.g. Finish the project report"
                            className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 rounded-xl ${errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.title && <p className="text-xs text-red-500 ml-1 mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Add details about this task..."
                            className="flex min-h-[100px] w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Due Date</label>
                            <Input
                                type="date"
                                {...register("dueDate")}
                                className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Priority</label>
                            <select
                                {...register("priority")}
                                className="flex h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Category <span className="text-destructive">*</span></label>
                            <Input
                                {...register("category")}
                                placeholder="e.g. Work, Personal"
                                className={`bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 rounded-xl ${errors.category ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                            {errors.category && <p className="text-xs text-red-500 ml-1 mt-1">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Status</label>
                            <select
                                {...register("status")}
                                className="flex h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-black/10 dark:border-white/10 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="rounded-xl hover:bg-black/5 dark:hover:bg-white/10">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 border-0">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Save Changes" : "Create Task"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
