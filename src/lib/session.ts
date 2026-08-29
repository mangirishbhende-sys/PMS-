import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/config";
import { getDirectoryUserByClerkId, getDirectoryUserByEmail, getDirectoryUserById, linkClerkId } from "@/lib/repository";
import type { DirectoryUser, Role } from "@/lib/types";
import { ROLE_HOME } from "@/lib/types";

export const DEMO_USER_COOKIE = "pms_demo_user_id";

export const getActor = cache(async function getActor(): Promise<DirectoryUser | null> {
  if (isClerkConfigured()) {
    const user = await currentUser();
    if (!user) return null;
    const clerkId = user.id;
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    if (!email) return null;
    const byClerk = await getDirectoryUserByClerkId(clerkId);
    if (byClerk) return byClerk;
    const byEmail = await getDirectoryUserByEmail(email);
    if (!byEmail) return null;
    return linkClerkId(byEmail.id, clerkId);
  }

  const jar = await cookies();
  const id = jar.get(DEMO_USER_COOKIE)?.value;
  if (!id) return null;
  return getDirectoryUserById(id);
});

export async function requireActor(): Promise<DirectoryUser> {
  const actor = await getActor();
  if (!actor) redirect("/");
  return actor;
}

export async function requireRole(role: Role): Promise<DirectoryUser> {
  const actor = await requireActor();
  if (actor.role !== role) redirect(ROLE_HOME[actor.role]);
  return actor;
}

export function canSeeUser(actor: DirectoryUser, target: DirectoryUser) {
  if (actor.id === target.id) return true;
  if (actor.role === "employee") return false;
  return actor.departmentId === target.departmentId;
}

export function visibleDepartmentId(actor: DirectoryUser) {
  return actor.departmentId;
}
