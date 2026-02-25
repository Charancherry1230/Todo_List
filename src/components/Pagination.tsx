"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";

interface PaginationProps {
    currentPage: number;
    totalTasks: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalTasks, limit, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalTasks / limit);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between py-4 border-t mt-6">
            <div className="text-sm text-muted-foreground">
                Showing <strong>{(currentPage - 1) * limit + 1}</strong> to <strong>{Math.min(currentPage * limit, totalTasks)}</strong> of <strong>{totalTasks}</strong> tasks
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <div className="text-sm font-medium px-2">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
