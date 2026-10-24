import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Para Server Components / Route Handlers. Los Server Components no pueden escribir
// cookies (el refresh real pasa por middleware.ts) — aquí el setAll puede fallar en
// un Server Component puro y se ignora a propósito (26-AUTH-MODERNO.md).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: el middleware ya refresca la sesión.
          }
        },
      },
    },
  );
}
