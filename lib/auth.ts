import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

/**
 * The authenticated user for this request, or null. Cached per-request so
 * repeated calls within a render don't re-query.
 */
export const getCurrentUser = cache(async () => {
  const id = await getSessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
});

/** Like getCurrentUser, but redirects to /login when signed out. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
