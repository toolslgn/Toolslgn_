import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ⚠️ SECURITY: Email whitelist for admin access
// Replace with your actual admin email(s)
const ADMIN_EMAILS = [
    "your-email@example.com",
    // Add more admin emails here if needed
];

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Only protect /dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value);
                        });
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        // Get user session
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Not authenticated - redirect to login
        if (!user) {
            const redirectUrl = new URL("/login", request.url);
            redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // Authenticated but email not in whitelist - unauthorized
        if (!ADMIN_EMAILS.includes(user.email || "")) {
            // Sign out the user
            await supabase.auth.signOut();

            // Redirect to unauthorized page
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // User is authenticated and whitelisted - allow access
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
