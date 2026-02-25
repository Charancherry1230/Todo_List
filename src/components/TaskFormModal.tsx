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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-50 w-full max-w-lg rounded-xl bg-background border p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold tracking-tight">
                        {initialData ? "Edit Task" : "Create New Task"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
                        <Input
                            {...register("title")}
                            placeholder="e.g. Finish the project report"
                            className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Add details about this task..."
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Due Date</label>
                            <Input type="date" {...register("dueDate")} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <select
                                {...register("priority")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
                            <Input
                                {...register("category")}
                                placeholder="e.g. Work, Personal"
                                className={errors.category ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                {...register("status")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Save Changes" : "Create Task"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
