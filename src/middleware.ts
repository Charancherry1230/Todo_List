import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "super-secret-key-replace-in-production";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;

    const publicPaths = ["/login", "/signup"];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // Allow API routes to be handled by the route themselves (we will protect them individually)
    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // If there's no session and it's not a public path, redirect to login
    if (!session && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If there is a session, verify it
    if (session) {
        try {
            await jwtVerify(session, key, { algorithms: ["HS256"] });

            // If valid session and trying to access login/signup, redirect to dashboard
            if (isPublicPath) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch {
            // If session is invalid, clear cookie and redirect to login
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("session");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
