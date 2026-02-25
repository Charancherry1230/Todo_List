"use client";

import { format } from "date-fns";
import { CheckCircle2, Circle, Edit2, Trash2, Clock, Tag } from "lucide-react";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

interface Task {
    id: string;
    title: string;
    description?: string | null;
    dueDate?: string | Date | null;
    priority: string;
    category: string;
    status: string;
    createdAt: string | Date;
}

interface TaskCardProps {
    task: Task;
    onToggle: (id: string, currentStatus: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    selected?: boolean;
    onSelect?: (id: string, selected: boolean) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, selected = false, onSelect }: TaskCardProps) {
    const isCompleted = task.status === "COMPLETED";

    const priorityColors: Record<string, string> = {
        LOW: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
        MEDIUM: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
        HIGH: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800/50",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group relative flex flex-col gap-3 rounded-2xl border p-5 shadow-lg backdrop-blur-md transition-all duration-300 ${isCompleted ? 'bg-white/30 dark:bg-black/20 border-white/10 dark:border-white/5' : 'bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/60 hover:shadow-xl hover:shadow-indigo-500/10 border-white/30 dark:border-white/10 hover:border-indigo-500/30'} ${selected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent' : ''}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    {onSelect && (
                        <div className="pt-1.5">
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => onSelect(task.id, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 bg-background text-indigo-600 focus:ring-indigo-600 transition-colors cursor-pointer"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => onToggle(task.id, task.status)}
                        className="mt-1 text-muted-foreground hover:text-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-full hover:scale-110 active:scale-95"
                        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500 drop-shadow-sm" />
                        ) : (
                            <Circle className="h-6 w-6" />
                        )}
                    </button>

                    <div className="flex flex-col gap-1.5 flex-1">
                        <h3 className={`font-semibold text-lg leading-tight transition-colors ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className={`text-sm line-clamp-2 ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                                {task.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
                                {task.priority}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground border border-border/50">
                                <Tag className="h-3 w-3" />
                                {task.category}
                            </span>

                            {task.dueDate && (
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${isCompleted ? 'bg-muted text-muted-foreground border-border/50' : new Date(task.dueDate) < new Date() ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400' : 'bg-indigo-500/5 text-indigo-700 dark:text-indigo-300 border-indigo-500/10'}`}>
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-600 rounded-full transition-colors" onClick={() => onEdit(task)}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 rounded-full transition-colors" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
