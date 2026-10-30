import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rutas públicas del funnel (modelo trial-first, ver ESTADO.md → Estrategia de monetización):
// landing → onboarding → paywall → login, SIN sesión. Solo /app (worker) y /panel (Gerente de
// HSE) + sus API privadas exigen sesión.
const PUBLIC_PATHS = ["/", "/onboarding", "/paywall", "/login", "/auth", "/api/auth", "/api/webhooks"];

function isPublicPath(path: string) {
  return PUBLIC_PATHS.some(
    (p) => path === p || (p !== "/" && path.startsWith(p + "/")),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: nada entre createServerClient y getUser() — getUser() valida el JWT
  // contra Supabase y dispara el refresh si el token expiró.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && !isPublicPath(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: devolver supabaseResponse tal cual (lleva las cookies refrescadas).
  return supabaseResponse;
}
