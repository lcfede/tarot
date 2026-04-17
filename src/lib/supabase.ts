import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Devuelve la ruta a la que debe ir el usuario según los productos que tiene.
 *   course + readings → /hub
 *   solo course       → /curso
 *   solo readings     → /lectura/app
 *   ninguno           → /
 */
export async function getPostLoginRoute(userId: string): Promise<string> {
  const { data } = await supabase
    .from("user_products")
    .select("product")
    .eq("user_id", userId);

  const products = (data ?? []).map((r: { product: string }) => r.product);
  const hasCourse = products.includes("course");
  const hasReadings = products.includes("readings");

  if (hasCourse && hasReadings) return "/hub";
  if (hasCourse) return "/curso";
  if (hasReadings) return "/lectura/app";
  return "/";
}
