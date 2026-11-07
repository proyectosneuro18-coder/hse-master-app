import { RegistrarServiceWorker } from "@/components/RegistrarServiceWorker";

// Área del trabajador de campo: activa el modo sin señal (ver public/sw.js).
export default function AppTrabajadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RegistrarServiceWorker />
      {children}
    </>
  );
}
