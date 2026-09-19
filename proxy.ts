import { NextRequest, NextResponse } from "next/server";

/**
 * Fast UX redirect only - cannot verify the JWT here, just checks the
 * cookie is present. The real security boundary is the backend's 401 on
 * GET /api/v1/students.
 */
export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token");

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/students"],
};
