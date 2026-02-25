"use client";

import { format } from "date-fns";
import { CheckCircle2, Circle, Edit2, Trash2, Clock, Tag } from "lucide-react";
import { Button } from "./ui/Button";

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
        LOW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        MEDIUM: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
        HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    };

    return (
        <div className={`group relative flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${isCompleted ? 'bg-muted/40 border-border/50' : 'bg-card border-border hover:border-primary/20'} ${selected ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-background' : ''}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    {onSelect && (
                        <div className="pt-1">
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => onSelect(task.id, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 bg-background text-primary focus:ring-primary cursor-pointer"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => onToggle(task.id, task.status)}
                        className="mt-0.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                            <Circle className="h-5 w-5" />
                        )}
                    </button>

                    <div className="flex flex-col gap-1 flex-1">
                        <h3 className={`font-medium leading-none ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className={`text-sm mt-1 line-clamp-2 ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                                {task.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
                                {task.priority}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                <Tag className="h-3 w-3" />
                                {task.category}
                            </span>

                            {task.dueDate && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isCompleted ? 'bg-muted text-muted-foreground' : new Date(task.dueDate) < new Date() ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-secondary text-secondary-foreground'}`}>
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(task)}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
