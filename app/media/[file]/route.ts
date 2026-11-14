import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS } from "@/lib/inventory";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Serves photos uploaded in /admin. Names are random and never reused, so they can be cached forever. */
export async function GET(_: Request, { params }: RouteContext<"/media/[file]">) {
  const { file } = await params;
  const m = /^[a-z0-9]+-[a-f0-9]{12}\.(jpg|png|webp)$/.exec(file);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(path.join(UPLOADS, file));
    return new Response(body, { headers: { "Content-Type": TYPES[m[1]], "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
