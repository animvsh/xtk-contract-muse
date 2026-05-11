import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

// Client-side middleware: attaches the Supabase access token as a Bearer
// header so the server-side `requireSupabaseAuth` middleware can validate it.
export const attachSupabaseAuthHeader = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next(token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  },
);
