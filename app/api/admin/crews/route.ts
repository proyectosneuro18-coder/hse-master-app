import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Renombra o archiva una cuadrilla. Protegido solo por RLS: la sesión del gerente decide.
export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const crewId: string | undefined = body?.crewId;
  const name: string | undefined = body?.name?.trim();
  const archived: boolean | undefined = typeof body?.archived === "boolean" ? body.archived : undefined;

  if (!crewId || (!name && archived === undefined)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // Archivar (soft-delete) solo se permite si la cuadrilla está vacía — nunca oculta el
  // acceso de un trabajador real que ya existe.
  if (archived) {
    const { count } = await supabase
      .from("workers")
      .select("user_id", { count: "exact", head: true })
      .eq("crew_id", crewId);
    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: "Esta cuadrilla todavía tiene trabajadores." }, { status: 400 });
    }
  }

  const cambios: Record<string, unknown> = {};
  if (name) cambios.name = name;
  if (archived !== undefined) cambios.archived = archived;

  const { error } = await supabase.from("crews").update(cambios).eq("id", crewId);
  if (error) {
    return NextResponse.json({ error: "No pudimos guardar los cambios." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
