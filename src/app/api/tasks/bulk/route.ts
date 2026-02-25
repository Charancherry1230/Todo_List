import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bulkDeleteSchema = z.object({
    ids: z.array(z.string())
});

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const result = bulkDeleteSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        await prisma.task.deleteMany({
            where: {
                id: {
                    in: result.data.ids
                }
            }
        });

        return NextResponse.json({ success: true, count: result.data.ids.length });
    } catch (error) {
        console.error("DELETE /api/tasks/bulk error", error);
        return NextResponse.json({ error: "Failed to delete tasks" }, { status: 500 });
    }
}
