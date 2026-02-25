import { jwtVerify, SignJWT, JWTPayload } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "super-secret-key-replace-in-production";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch {
        return null;
    }
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function setSession(userId: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expires });

    cookies().set("session", session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export function clearSession() {
    cookies().set("session", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}
