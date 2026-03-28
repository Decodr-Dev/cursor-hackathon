import { cookies } from "next/headers";

const COOKIE = "kasa_session";
const MAX_AGE = 60 * 60 * 24 * 365;

export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;
  const sessionId = crypto.randomUUID();
  store.set(COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return sessionId;
}

export async function getSessionId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE)?.value;
}
