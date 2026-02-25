"use client";

import { CheckCircle2, Circle, ListTodo } from "lucide-react";

interface StatsProps {
    total: number;
    completed: number;
    pending: number;
}

export function TaskStats({ total, completed, pending }: StatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                    <h3 className="text-3xl font-bold mt-1 text-foreground">{total}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <ListTodo className="h-6 w-6" />
                </div>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h3 className="text-3xl font-bold mt-1 text-foreground">{completed}</h3>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <h3 className="text-3xl font-bold mt-1 text-foreground">{pending}</h3>
                </div>
                <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                    <Circle className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
