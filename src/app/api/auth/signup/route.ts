import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { setSession } from "@/lib/auth";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = signupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const { name, email, password } = result.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: { formErrors: ["Email already in use"], fieldErrors: {} } }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        await setSession(user.id);

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
}
