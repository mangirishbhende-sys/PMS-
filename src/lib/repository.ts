import { DEPARTMENTS } from "@/lib/seed-data";
import { getDemoStore } from "@/lib/demo-store";
import { getServiceSupabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/config";
import type {
  Department,
  DirectoryUser,
  Goal,
  GoalStatus,
  Meeting,
  Review,
  ReviewStatus,
} from "@/lib/types";

function mapUser(row: Record<string, unknown>): DirectoryUser {
  return {
    id: String(row.id),
    clerkId: (row.clerk_id as string | null) ?? null,
    email: String(row.email),
    fullName: String(row.full_name),
    role: row.role as DirectoryUser["role"],
    departmentId: String(row.department_id),
    managerId: (row.manager_id as string | null) ?? null,
    jobTitle: String(row.job_title),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapGoal(row: Record<string, unknown>): Goal {
  return {
    id: String(row.id),
    employeeId: String(row.employee_id),
    title: String(row.title),
    description: String(row.description),
    type: row.type as Goal["type"],
    targetValue: Number(row.target_value),
    currentValue: Number(row.current_value),
    unit: String(row.unit),
    progress: Number(row.progress),
    status: row.status as Goal["status"],
    managerComment: (row.manager_comment as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    employeeId: String(row.employee_id),
    managerId: String(row.manager_id),
    cycleName: String(row.cycle_name),
    selfRating: row.self_rating == null ? null : Number(row.self_rating),
    selfComments: (row.self_comments as string | null) ?? null,
    managerRating: row.manager_rating == null ? null : Number(row.manager_rating),
    managerComments: (row.manager_comments as string | null) ?? null,
    hrNotes: (row.hr_notes as string | null) ?? null,
    status: row.status as Review["status"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapMeeting(row: Record<string, unknown>): Meeting {
  return {
    id: String(row.id),
    employeeId: String(row.employee_id),
    managerId: String(row.manager_id),
    title: String(row.title),
    scheduledAt: String(row.scheduled_at),
    durationMinutes: Number(row.duration_minutes),
    meetUrl: String(row.meet_url),
    status: row.status as Meeting["status"],
    notes: (row.notes as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listDepartments(): Promise<Department[]> {
  const sb = getServiceSupabase();
  if (!sb) return DEPARTMENTS;
  const { data, error } = await sb.from("departments").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
  }));
}

export async function getDirectoryUserById(id: string) {
  const sb = getServiceSupabase();
  if (!sb) return getDemoStore().users.find((u) => u.id === id) ?? null;
  const { data, error } = await sb.from("users").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapUser(data) : null;
}

export async function getDirectoryUserByEmail(email: string) {
  const sb = getServiceSupabase();
  if (!sb) {
    return (
      getDemoStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
      null
    );
  }
  const { data, error } = await sb
    .from("users")
    .select("*")
    .ilike("email", email)
    .maybeSingle();
  if (error) throw error;
  return data ? mapUser(data) : null;
}

export async function getDirectoryUserByClerkId(clerkId: string) {
  const sb = getServiceSupabase();
  if (!sb) return getDemoStore().users.find((u) => u.clerkId === clerkId) ?? null;
  const { data, error } = await sb
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapUser(data) : null;
}

export async function linkClerkId(userId: string, clerkId: string) {
  const sb = getServiceSupabase();
  if (!sb) {
    const user = getDemoStore().users.find((u) => u.id === userId);
    if (user) user.clerkId = clerkId;
    return user ?? null;
  }
  const { data, error } = await sb
    .from("users")
    .update({ clerk_id: clerkId })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return mapUser(data);
}

export async function listDirectory(departmentId: string) {
  const sb = getServiceSupabase();
  if (!sb) {
    return getDemoStore()
      .users.filter((u) => u.departmentId === departmentId)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }
  const { data, error } = await sb
    .from("users")
    .select("*")
    .eq("department_id", departmentId)
    .order("full_name");
  if (error) throw error;
  return (data ?? []).map(mapUser);
}

export async function listGoalsForEmployees(employeeIds: string[]) {
  if (employeeIds.length === 0) return [] as Goal[];
  const sb = getServiceSupabase();
  if (!sb) {
    return getDemoStore().goals.filter((g) => employeeIds.includes(g.employeeId));
  }
  const { data, error } = await sb.from("goals").select("*").in("employee_id", employeeIds);
  if (error) throw error;
  return (data ?? []).map(mapGoal);
}

export async function listReviewsForEmployees(employeeIds: string[]) {
  if (employeeIds.length === 0) return [] as Review[];
  const sb = getServiceSupabase();
  if (!sb) {
    return getDemoStore().reviews.filter((r) => employeeIds.includes(r.employeeId));
  }
  const { data, error } = await sb.from("reviews").select("*").in("employee_id", employeeIds);
  if (error) throw error;
  return (data ?? []).map(mapReview);
}

export async function listMeetingsForEmployees(employeeIds: string[]) {
  if (employeeIds.length === 0) return [] as Meeting[];
  const sb = getServiceSupabase();
  if (!sb) {
    return getDemoStore().meetings.filter(
      (m) => employeeIds.includes(m.employeeId) || employeeIds.includes(m.managerId),
    );
  }
  const { data, error } = await sb
    .from("meetings")
    .select("*")
    .in("employee_id", employeeIds)
    .order("scheduled_at");
  if (error) throw error;
  return (data ?? []).map(mapMeeting);
}

export async function insertGoal(goal: Goal) {
  const sb = getServiceSupabase();
  if (!sb) {
    getDemoStore().goals.unshift(goal);
    return goal;
  }
  const { data, error } = await sb
    .from("goals")
    .insert({
      id: goal.id,
      employee_id: goal.employeeId,
      title: goal.title,
      description: goal.description,
      type: goal.type,
      target_value: goal.targetValue,
      current_value: goal.currentValue,
      unit: goal.unit,
      progress: goal.progress,
      status: goal.status,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapGoal(data);
}

export async function updateGoal(
  id: string,
  patch: Partial<{
    status: GoalStatus;
    managerComment: string | null;
    progress: number;
    currentValue: number;
  }>,
) {
  const sb = getServiceSupabase();
  if (!sb) {
    const goal = getDemoStore().goals.find((g) => g.id === id);
    if (!goal) return null;
    Object.assign(goal, patch, { updatedAt: new Date().toISOString() });
    return goal;
  }
  const row: Record<string, unknown> = {};
  if (patch.status) row.status = patch.status;
  if (patch.managerComment !== undefined) row.manager_comment = patch.managerComment;
  if (patch.progress !== undefined) row.progress = patch.progress;
  if (patch.currentValue !== undefined) row.current_value = patch.currentValue;
  const { data, error } = await sb.from("goals").update(row).eq("id", id).select("*").single();
  if (error) throw error;
  return mapGoal(data);
}

export async function updateReview(
  id: string,
  patch: Partial<{
    selfRating: number | null;
    selfComments: string | null;
    managerRating: number | null;
    managerComments: string | null;
    hrNotes: string | null;
    status: ReviewStatus;
  }>,
) {
  const sb = getServiceSupabase();
  if (!sb) {
    const review = getDemoStore().reviews.find((r) => r.id === id);
    if (!review) return null;
    Object.assign(review, patch, { updatedAt: new Date().toISOString() });
    return review;
  }
  const row: Record<string, unknown> = {};
  if (patch.selfRating !== undefined) row.self_rating = patch.selfRating;
  if (patch.selfComments !== undefined) row.self_comments = patch.selfComments;
  if (patch.managerRating !== undefined) row.manager_rating = patch.managerRating;
  if (patch.managerComments !== undefined) row.manager_comments = patch.managerComments;
  if (patch.hrNotes !== undefined) row.hr_notes = patch.hrNotes;
  if (patch.status) row.status = patch.status;
  const { data, error } = await sb.from("reviews").update(row).eq("id", id).select("*").single();
  if (error) throw error;
  return mapReview(data);
}

export async function insertMeeting(meeting: Meeting) {
  const sb = getServiceSupabase();
  if (!sb) {
    getDemoStore().meetings.unshift(meeting);
    return meeting;
  }
  const { data, error } = await sb
    .from("meetings")
    .insert({
      id: meeting.id,
      employee_id: meeting.employeeId,
      manager_id: meeting.managerId,
      title: meeting.title,
      scheduled_at: meeting.scheduledAt,
      duration_minutes: meeting.durationMinutes,
      meet_url: meeting.meetUrl,
      status: meeting.status,
      notes: meeting.notes,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapMeeting(data);
}

export function usingLiveDatabase() {
  return isSupabaseConfigured();
}
