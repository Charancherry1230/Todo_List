import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: String(session.userId) },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
