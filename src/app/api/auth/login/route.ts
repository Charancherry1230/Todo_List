import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { setSession } from "@/lib/auth";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: { formErrors: ["Invalid email or password"], fieldErrors: {} } }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: { formErrors: ["Invalid email or password"], fieldErrors: {} } }, { status: 401 });
        }

        await setSession(user.id);

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
    }
}
