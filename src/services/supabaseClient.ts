import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 👇 DEBUG TEMPORAL (para ver si Vercel las está metiendo)
console.log("VITE_SUPABASE_URL:", url ? "OK" : "MISSING");
console.log("VITE_SUPABASE_ANON_KEY:", anon ? "OK" : "MISSING");

if (!url) throw new Error("VITE_SUPABASE_URL is missing");
if (!anon) throw new Error("VITE_SUPABASE_ANON_KEY is missing");

export const supabase = createClient(url, anon);