import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SOLO para código de servidor (route handlers de webhooks, emisión de sesión worker).
// La secret key salta RLS por completo — nunca importar este archivo desde un componente
// que pueda terminar en el bundle del navegador (09-SEGURIDAD.md).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
