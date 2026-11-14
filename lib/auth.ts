import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

// One shared admin password (ADMIN_PASSWORD in .env.local). A successful login sets a signed, httpOnly cookie
// that expires after a week. Signing uses SESSION_SECRET, so changing it signs everyone out.
const COOKIE = "kgl_admin";
const WEEK = 7 * 24 * 3600;

const secret = () => process.env.SESSION_SECRET || "";
export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && secret().length >= 16);

const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");
const sha = (v: string) => createHash("sha256").update(v).digest();

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  // compare hashes so the check takes the same time whatever the input length
  return Boolean(expected) && timingSafeEqual(sha(input), sha(expected!));
}

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + WEEK);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: WEEK,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  await connection(); // checks the clock, so always evaluate per request
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig || Number(exp) * 1000 < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Guard for admin pages and every admin action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
