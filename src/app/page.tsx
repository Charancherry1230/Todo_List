"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { FilterBar } from "@/components/FilterBar";
import { TaskStats } from "@/components/TaskStats";
import { Pagination } from "@/components/Pagination";
import { TaskFormModal, TaskFormData } from "@/components/TaskFormModal";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, ListTodo, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | Date | null;
  priority: string;
  category: string;
  status: string;
  createdAt: string | Date;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);

  // State for filtering/pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("dueDate");
  const [page, setPage] = useState(1);
  const limit = 10;

  // View state
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, categoryFilter, sortBy]);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sort: sortBy
      });

      const [res, userRes] = await Promise.all([
        fetch(`/api/tasks?${query.toString()}`),
        fetch('/api/auth/me')
      ]);

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      setTasks(data.tasks);
      setTotalItems(data.total);
      setStats(data.stats);
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, priorityFilter, categoryFilter, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Optimistic UI
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setStats(prev => ({
      ...prev,
      completed: newStatus === "COMPLETED" ? prev.completed + 1 : prev.completed - 1,
      pending: newStatus === "PENDING" ? prev.pending + 1 : prev.pending - 1,
    }));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to update task status");
      fetchTasks(); // Revert on failure
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success("Task deleted");

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
      fetchTasks();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedTasks.size} tasks?`)) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/tasks/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedTasks) })
      });

      if (!res.ok) throw new Error();

      toast.success(`${selectedTasks.size} tasks deleted`);
      setSelectedTasks(new Set());
      fetchTasks();
    } catch {
      toast.error("Bulk delete failed");
      setIsLoading(false);
    }
  };

  const toggleSelectTask = (id: string, selected: boolean) => {
    const newSet = new Set(selectedTasks);
    if (selected) newSet.add(id);
    else newSet.delete(id);
    setSelectedTasks(newSet);
  };

  const handleCreateOrUpdate = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error();
        toast.success("Task updated successfully");
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error();
        toast.success("Task created successfully");
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error(editingTask ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 dark:from-indigo-950/50 dark:via-purple-900/20 dark:to-pink-950/30 selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-50"></div>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-muted-foreground mt-2 text-base">Let&apos;s map out your day and conquer those goals.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedTasks.size > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete} className="animate-in fade-in slide-in-from-right-4">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedTasks.size})
              </Button>
            )}
            <Button onClick={openCreateModal} className="w-full md:w-auto shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </motion.div>

        <TaskStats {...stats} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl mb-8 overflow-hidden"
        >
          <FilterBar
            search={search} setSearch={setSearch}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            sortBy={sortBy} setSortBy={setSortBy}
            categories={categories}
          />

          <div className="p-5 pt-0">
            {isLoading && tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                <p className="animate-pulse">Loading your universe...</p>
              </div>
            ) : tasks.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleStatus}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      selected={selectedTasks.has(task.id)}
                      onSelect={toggleSelectTask}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 p-5 rounded-full mb-5">
                  <ListTodo className="h-12 w-12 text-indigo-500 opacity-80" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">No tasks found</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  {search || statusFilter !== "ALL" || categoryFilter !== "ALL"
                    ? "Try adjusting your filters or search terms to find what you're looking for."
                    : "You don&apos;t have any tasks yet. Create one to get started on your journey!"}
                </p>
                <Button
                  onClick={openCreateModal}
                  className="bg-zinc-900 border border-zinc-200 shadow-sm text-zinc-50 hover:bg-zinc-900/90 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Create your first task
                </Button>
              </motion.div>
            )}

            <Pagination
              currentPage={page}
              totalTasks={totalItems}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        </motion.div>
      </main>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTask}
        onSubmit={handleCreateOrUpdate}
        isLoading={isSubmitting}
      />
    </div>
  );
}
