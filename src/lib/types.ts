export type Role = "employee" | "manager" | "hr";
export type GoalType = "kra" | "kpi" | "okr";
export type GoalStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "completed";
export type ReviewStatus =
  | "not_started"
  | "self_in_progress"
  | "submitted"
  | "manager_reviewed"
  | "finalized";
export type MeetingStatus = "scheduled" | "completed" | "cancelled";

export type Department = {
  id: string;
  name: string;
  code: string;
};

export type DirectoryUser = {
  id: string;
  clerkId: string | null;
  email: string;
  fullName: string;
  role: Role;
  departmentId: string;
  managerId: string | null;
  jobTitle: string;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  status: GoalStatus;
  managerComment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  employeeId: string;
  managerId: string;
  cycleName: string;
  selfRating: number | null;
  selfComments: string | null;
  managerRating: number | null;
  managerComments: string | null;
  hrNotes: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};

export type Meeting = {
  id: string;
  employeeId: string;
  managerId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  meetUrl: string;
  status: MeetingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const RATING_SCALE = [
  { value: 1, label: "Needs improvement" },
  { value: 2, label: "Developing" },
  { value: 3, label: "Meets expectations" },
  { value: 4, label: "Exceeds expectations" },
  { value: 5, label: "Outstanding" },
] as const;

export const ROLE_HOME: Record<Role, string> = {
  employee: "/employee",
  manager: "/manager",
  hr: "/hr",
};
