import "server-only";
import { cookies } from "next/headers";
import { getIronSession, unsealData, type IronSession, type SessionOptions } from "iron-session";
import bcrypt from "bcryptjs";

export type SessionData = {
  userId?: string;
  email?: string;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

export const SESSION_COOKIE_NAME = "hansalux_admin_session";

export const sessionOptions: SessionOptions = {
  cookieName: SESSION_COOKIE_NAME,
  password: process.env.SESSION_SECRET!,
  ttl: SESSION_TTL_SECONDS,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function readSessionCookie(value: string | undefined): Promise<SessionData | null> {
  if (!value) return null;
  try {
    return await unsealData<SessionData>(value, {
      password: sessionOptions.password,
      ttl: SESSION_TTL_SECONDS,
    });
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
