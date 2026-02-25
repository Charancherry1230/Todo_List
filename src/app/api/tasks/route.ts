import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    category: z.string().min(1, "Category is required"),
    status: z.enum(["PENDING", "COMPLETED"]).optional()
});

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "ALL";
        const priority = searchParams.get("priority") || "ALL";
        const category = searchParams.get("category") || "ALL";
        const sort = searchParams.get("sort") || "dueDate";

        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {
            userId: String(session.userId)
        };
        if (search) where.title = { contains: search };
        // Prisma SQLite doesn't support case insensitive contains easily without `mode: 'insensitive'` which is only postgres, but we'll stick to basic.
        if (status !== "ALL") where.status = status;
        if (priority !== "ALL") where.priority = priority;
        if (category !== "ALL") where.category = category;

        let orderBy: Record<string, unknown> = {};
        if (sort === "dueDate") orderBy = { dueDate: "asc" };
        else if (sort === "priority") orderBy = { priority: "desc" };
        else if (sort === "title") orderBy = { title: "asc" };
        else orderBy = { createdAt: "desc" };

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.task.count({ where }),
        ]);

        // get categories
        const allCategories = await prisma.task.findMany({
            where: { userId: String(session.userId) },
            select: { category: true },
            distinct: ['category'],
        });

        // stats
        const totalCount = total;
        const completedCount = await prisma.task.count({ where: { userId: String(session.userId), status: "COMPLETED" } });
        const pendingCount = await prisma.task.count({ where: { userId: String(session.userId), status: "PENDING" } });

        return NextResponse.json({
            tasks,
            total,
            stats: { total: totalCount, completed: completedCount, pending: pendingCount },
            categories: allCategories.map((c: { category: string }) => c.category),
        });
    } catch (error) {
        console.error("GET /api/tasks error", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = taskSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const task = await prisma.task.create({
            data: {
                title: result.data.title,
                description: result.data.description,
                dueDate: result.data.dueDate,
                priority: result.data.priority, // Is String in SQLite but validated as ENUM
                category: result.data.category,
                status: result.data.status || "PENDING",
                userId: String(session.userId)
            }
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("POST /api/tasks error", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
