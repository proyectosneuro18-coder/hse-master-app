import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Renombra la organización del Gerente de HSE. Protegido solo por RLS (migración
// 0007_organization_rename.sql): la sesión del gerente decide, igual que en /api/admin/crews.
export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name: string | undefined = body?.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "El nombre no puede quedar vacío." }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .maybeSingle<{ org_id: string }>();
  if (!membership) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { error } = await supabase
    .from("organizations")
    .update({ name })
    .eq("id", membership.org_id);
  if (error) {
    return NextResponse.json({ error: "No pudimos guardar el cambio." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
