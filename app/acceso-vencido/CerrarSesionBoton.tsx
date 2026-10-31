"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CerrarSesionBoton() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  async function salir() {
    setSaliendo(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login/trabajador");
  }

  return (
    <button type="button" className="av-boton" onClick={salir} disabled={saliendo}>
      {saliendo ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
