import { z } from "zod";

// Variable opcional vacía ("") en .env.local (placeholder del scaffold) cuenta como "no
// configurada todavía", no como un valor inválido — si no, tsc/build truenan localmente
// aunque la variable requerida real solo falte en producción.
const optionalString = () =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().min(1).optional());
const optionalEmail = () =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().email().optional());

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: optionalString(),
  EMAIL_FROM: optionalEmail(),
  HOTMART_HOTTOK: optionalString(),
  HOTMART_PRODUCT_ID: optionalString(),
});

// Falla al arrancar si falta una variable requerida — nunca correr con un valor de juguete (09-SEGURIDAD.md).
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  HOTMART_HOTTOK: process.env.HOTMART_HOTTOK,
  HOTMART_PRODUCT_ID: process.env.HOTMART_PRODUCT_ID,
});
