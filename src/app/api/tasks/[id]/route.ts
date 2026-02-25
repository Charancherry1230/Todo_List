import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    category: z.string().optional(),
    status: z.enum(["PENDING", "COMPLETED"]).optional()
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const result = taskUpdateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        // Filter out undefined fields to only update provided fields
        const updateData = Object.fromEntries(
            Object.entries(result.data).filter((entry) => entry[1] !== undefined)
        );

        const updatedTask = await prisma.task.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("PATCH /api/tasks/[id] error", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.task.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/tasks/[id] error", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
