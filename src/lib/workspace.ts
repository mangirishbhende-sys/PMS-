import {
  listDepartments,
  listDirectory,
  listGoalsForEmployees,
  listMeetingsForEmployees,
  listReviewsForEmployees,
} from "@/lib/repository";
import type { DirectoryUser } from "@/lib/types";

export async function loadScopedData(actor: DirectoryUser) {
  const departments = await listDepartments();
  const department = departments.find((d) => d.id === actor.departmentId);
  const people =
    actor.role === "employee"
      ? [actor]
      : await listDirectory(actor.departmentId);
  const ids = people.map((p) => p.id);
  const [goals, reviews, meetings] = await Promise.all([
    listGoalsForEmployees(ids),
    listReviewsForEmployees(ids),
    listMeetingsForEmployees(ids),
  ]);
  const directoryById = Object.fromEntries(people.map((p) => [p.id, p]));
  return { departments, department, people, goals, reviews, meetings, directoryById };
}
