import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Ranking real de cuadrillas para app/app/ranking — ver migración
// 0008_ranking_cuadrillas.sql (el RPC agrega puntos por cuadrilla sin exponer intentos
// individuales de otros trabajadores, que RLS nunca dejaría leer directo).
export async function GET(request: NextRequest) {
  const periodo = request.nextUrl.searchParams.get("periodo") === "mes" ? "mes" : "semana";

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("obtener_ranking_cuadrillas", { p_periodo: periodo });
  if (error) {
    return NextResponse.json({ error: "No pudimos cargar el ranking." }, { status: 500 });
  }

  return NextResponse.json({ filas: data ?? [] });
}
