import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL as string | undefined
)?.trim();

const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined
)?.trim();

export const supabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

/*
 * Important:
 * The public MyndWorks website must never fail to render simply because
 * Supabase environment variables are missing from a deployment.
 *
 * These fallback values create an inert client. No request is made until
 * an Admin/Event feature actually calls Supabase.
 *
 * Production/preview Events still require the real VITE_SUPABASE_* values
 * to be configured in Vercel.
 */
const safeUrl =
  supabaseUrl || "https://placeholder.supabase.co";

const safeKey =
  supabasePublishableKey || "placeholder-publishable-key";

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: supabaseConfigured,
    autoRefreshToken: supabaseConfigured,
    detectSessionInUrl: supabaseConfigured,
  },
});

if (!supabaseConfigured) {
  console.warn(
    "MyndWorks: Supabase environment variables are not configured. Public website remains available; Admin and Events data features require VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}
