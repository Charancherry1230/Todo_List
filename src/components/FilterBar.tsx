"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "./ui/Input";

interface FilterBarProps {
    search: string;
    setSearch: (v: string) => void;
    statusFilter: string;
    setStatusFilter: (v: string) => void;
    priorityFilter: string;
    setPriorityFilter: (v: string) => void;
    categoryFilter: string;
    setCategoryFilter: (v: string) => void;
    sortBy: string;
    setSortBy: (v: string) => void;
    categories: string[];
}

export function FilterBar({
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    categoryFilter, setCategoryFilter,
    sortBy, setSortBy,
    categories
}: FilterBarProps) {

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-muted/30 border rounded-xl">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    className="pl-9 bg-background w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-background border px-3 rounded-md h-10">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="bg-transparent text-sm focus:outline-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                <select
                    className="h-10 border rounded-md px-3 bg-background text-sm focus:outline-none cursor-pointer"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="ALL">All Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <select
                    className="h-10 border rounded-md px-3 bg-background text-sm focus:outline-none cursor-pointer"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="ALL">All Categories</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select
                    className="h-10 border rounded-md px-3 bg-background text-sm focus:outline-none font-medium cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="dueDate">Sort: Due Date</option>
                    <option value="priority">Sort: Priority</option>
                    <option value="title">Sort: Title</option>
                    <option value="createdAt">Sort: Newest</option>
                </select>
            </div>
        </div>
    );
}
