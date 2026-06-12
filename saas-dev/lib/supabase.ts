import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
}

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}