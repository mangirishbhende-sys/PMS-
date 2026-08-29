"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_USER_COOKIE, requireActor } from "@/lib/session";
import {
  getDirectoryUserById,
  insertGoal,
  insertMeeting,
  listDepartments,
  updateGoal,
  updateReview,
} from "@/lib/repository";
import { DEPARTMENTS } from "@/lib/seed-data";
import type { GoalType } from "@/lib/types";
import { ROLE_HOME } from "@/lib/types";
import { sendReviewFinalizedEmail } from "@/lib/email";

function newId() {
  return crypto.randomUUID();
}

function stamp() {
  return new Date().toISOString();
}

function mockMeetUrl(departmentCode: string) {
  const chunk = (len: number) =>
    Math.random()
      .toString(36)
      .replace(/[^a-z0-9]/g, "")
      .slice(2, 2 + len)
      .padEnd(len, "x");
  return `https://meet.google.com/${departmentCode.toLowerCase()}-${chunk(3)}-${chunk(3)}`;
}

export async function startDemoSession(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const user = await getDirectoryUserById(userId);
  if (!user) throw new Error("Unknown demo user");
  const jar = await cookies();
  jar.set(DEMO_USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect(ROLE_HOME[user.role]);
}

export async function clearDemoSession() {
  const jar = await cookies();
  jar.delete(DEMO_USER_COOKIE);
  redirect("/");
}

export async function createGoalAction(formData: FormData) {
  const actor = await requireActor();
  if (actor.role !== "employee") throw new Error("Only employees create goals");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "kpi") as GoalType;
  const targetValue = Number(formData.get("targetValue") ?? 100);
  const unit = String(formData.get("unit") ?? "%").trim() || "%";
  if (!title) throw new Error("Title is required");
  await insertGoal({
    id: newId(),
    employeeId: actor.id,
    title,
    description,
    type,
    targetValue,
    currentValue: 0,
    unit,
    progress: 0,
    status: "pending_approval",
    managerComment: null,
    createdAt: stamp(),
    updatedAt: stamp(),
  });
  revalidatePath("/employee");
  revalidatePath("/employee/goals");
  revalidatePath("/manager/goals");
}

export async function decideGoalAction(formData: FormData) {
  const actor = await requireActor();
  if (actor.role === "employee") throw new Error("Not allowed");
  const id = String(formData.get("id"));
  const decision = String(formData.get("decision"));
  const comment = String(formData.get("comment") ?? "").trim();
  await updateGoal(id, {
    status: decision === "approve" ? "approved" : "rejected",
    managerComment: comment || (decision === "approve" ? "Approved" : "Please revise"),
  });
  revalidatePath("/manager/goals");
  revalidatePath("/employee/goals");
  revalidatePath("/hr");
}

export async function saveSelfAppraisalAction(formData: FormData) {
  const actor = await requireActor();
  if (actor.role !== "employee") throw new Error("Only employees submit self-appraisals");
  const id = String(formData.get("id"));
  const selfRating = Number(formData.get("selfRating"));
  const selfComments = String(formData.get("selfComments") ?? "").trim();
  const submit = String(formData.get("intent")) === "submit";
  await updateReview(id, {
    selfRating,
    selfComments,
    status: submit ? "submitted" : "self_in_progress",
  });
  revalidatePath("/employee/appraisal");
  revalidatePath("/manager/reviews");
}

export async function saveManagerReviewAction(formData: FormData) {
  const actor = await requireActor();
  if (actor.role !== "manager" && actor.role !== "hr") throw new Error("Not allowed");
  const id = String(formData.get("id"));
  const managerRating = Number(formData.get("managerRating"));
  const managerComments = String(formData.get("managerComments") ?? "").trim();
  await updateReview(id, {
    managerRating,
    managerComments,
    status: "manager_reviewed",
  });
  revalidatePath("/manager/reviews");
  revalidatePath("/hr/reviews");
}

export async function finalizeReviewAction(formData: FormData) {
  const actor = await requireActor();
  if (actor.role !== "hr") throw new Error("Only HR can finalize");
  const id = String(formData.get("id"));
  const hrNotes = String(formData.get("hrNotes") ?? "").trim();
  const review = await updateReview(id, { hrNotes, status: "finalized" });
  if (review) {
    const employee = await getDirectoryUserById(review.employeeId);
    if (employee) {
      await sendReviewFinalizedEmail({
        to: employee.email,
        employeeName: employee.fullName,
        cycleName: review.cycleName,
        managerRating: review.managerRating,
      });
    }
  }
  revalidatePath("/hr/reviews");
  revalidatePath("/employee/appraisal");
}

export async function scheduleMeetingAction(formData: FormData) {
  const actor = await requireActor();
  const employeeId = String(formData.get("employeeId"));
  const scheduledAt = String(formData.get("scheduledAt"));
  const title = String(formData.get("title") ?? "Appraisal 1-on-1").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const employee = await getDirectoryUserById(employeeId);
  if (!employee) throw new Error("Employee not found");
  if (employee.departmentId !== actor.departmentId) {
    throw new Error("Cross-department scheduling is blocked");
  }
  const managerId =
    actor.role === "manager" ? actor.id : employee.managerId ?? actor.id;
  const departments = await listDepartments();
  const dept =
    departments.find((d) => d.id === actor.departmentId) ??
    DEPARTMENTS.find((d) => d.id === actor.departmentId);
  await insertMeeting({
    id: newId(),
    employeeId,
    managerId,
    title,
    scheduledAt: new Date(scheduledAt).toISOString(),
    durationMinutes: 45,
    meetUrl: mockMeetUrl(dept?.code ?? "pms"),
    status: "scheduled",
    notes: notes || null,
    createdAt: stamp(),
    updatedAt: stamp(),
  });
  revalidatePath("/employee/meetings");
  revalidatePath("/manager/meetings");
  revalidatePath("/hr/meetings");
}
