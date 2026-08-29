import type { Department, DirectoryUser, Goal, Meeting, Review } from "@/lib/types";

export const DEPARTMENTS: Department[] = [
  { id: "00000000-0000-4000-8000-000000000101", name: "Finance", code: "FIN" },
  { id: "00000000-0000-4000-8000-000000000102", name: "IT", code: "IT" },
  { id: "00000000-0000-4000-8000-000000000103", name: "Sales", code: "SAL" },
  { id: "00000000-0000-4000-8000-000000000104", name: "Marketing", code: "MKT" },
];

const now = "2026-08-01T09:00:00.000Z";

function user(
  n: string,
  email: string,
  fullName: string,
  role: DirectoryUser["role"],
  departmentId: string,
  managerId: string | null,
  jobTitle: string,
): DirectoryUser {
  return {
    id: `00000000-0000-4000-8000-000000000${n}`,
    clerkId: null,
    email,
    fullName,
    role,
    departmentId,
    managerId,
    jobTitle,
    createdAt: now,
    updatedAt: now,
  };
}

const FIN = DEPARTMENTS[0].id;
const IT = DEPARTMENTS[1].id;
const SAL = DEPARTMENTS[2].id;
const MKT = DEPARTMENTS[3].id;

export const USERS: DirectoryUser[] = [
  user("201", "priya.shah@northstar.demo", "Priya Shah", "hr", FIN, null, "HR Business Partner, Finance"),
  user("202", "david.chen@northstar.demo", "David Chen", "manager", FIN, null, "Finance Manager"),
  user("203", "aisha.rahman@northstar.demo", "Aisha Rahman", "employee", FIN, "00000000-0000-4000-8000-000000000202", "Financial Analyst"),
  user("204", "marcus.webb@northstar.demo", "Marcus Webb", "employee", FIN, "00000000-0000-4000-8000-000000000202", "Senior Accountant"),
  user("205", "elena.rossi@northstar.demo", "Elena Rossi", "employee", FIN, "00000000-0000-4000-8000-000000000202", "FP&A Associate"),
  user("206", "jordan.blake@northstar.demo", "Jordan Blake", "hr", IT, null, "HR Business Partner, IT"),
  user("207", "sofia.patel@northstar.demo", "Sofia Patel", "manager", IT, null, "Engineering Manager"),
  user("208", "liam.oconnor@northstar.demo", "Liam O'Connor", "employee", IT, "00000000-0000-4000-8000-000000000207", "Platform Engineer"),
  user("209", "maya.chen@northstar.demo", "Maya Chen", "employee", IT, "00000000-0000-4000-8000-000000000207", "Product Engineer"),
  user("210", "noah.kim@northstar.demo", "Noah Kim", "employee", IT, "00000000-0000-4000-8000-000000000207", "Security Engineer"),
  user("211", "harper.diaz@northstar.demo", "Harper Diaz", "manager", SAL, null, "Sales Manager"),
  user("212", "sam.okonkwo@northstar.demo", "Sam Okonkwo", "employee", SAL, "00000000-0000-4000-8000-000000000211", "Account Executive"),
  user("213", "riley.park@northstar.demo", "Riley Park", "employee", SAL, "00000000-0000-4000-8000-000000000211", "Sales Development Rep"),
  user("214", "nina.volkov@northstar.demo", "Nina Volkov", "employee", SAL, "00000000-0000-4000-8000-000000000211", "Customer Success Manager"),
  user("215", "ava.thompson@northstar.demo", "Ava Thompson", "hr", MKT, null, "HR Business Partner, Marketing"),
  user("216", "chris.nguyen@northstar.demo", "Chris Nguyen", "manager", MKT, null, "Marketing Manager"),
  user("217", "jade.morales@northstar.demo", "Jade Morales", "employee", MKT, "00000000-0000-4000-8000-000000000216", "Content Strategist"),
  user("218", "ben.foster@northstar.demo", "Ben Foster", "employee", MKT, "00000000-0000-4000-8000-000000000216", "Demand Generation Specialist"),
];

function goal(
  n: string,
  employeeId: string,
  title: string,
  description: string,
  type: Goal["type"],
  targetValue: number,
  currentValue: number,
  unit: string,
  status: Goal["status"],
  managerComment: string | null = null,
): Goal {
  const progress = Math.min(100, Math.round((currentValue / targetValue) * 100));
  return {
    id: `00000000-0000-4000-8000-000000000${n}`,
    employeeId,
    title,
    description,
    type,
    targetValue,
    currentValue,
    unit,
    progress,
    status,
    managerComment,
    createdAt: now,
    updatedAt: now,
  };
}

const Aisha = "00000000-0000-4000-8000-000000000203";
const Marcus = "00000000-0000-4000-8000-000000000204";
const Elena = "00000000-0000-4000-8000-000000000205";
const Liam = "00000000-0000-4000-8000-000000000208";
const Maya = "00000000-0000-4000-8000-000000000209";
const Noah = "00000000-0000-4000-8000-000000000210";
const Sam = "00000000-0000-4000-8000-000000000212";
const Riley = "00000000-0000-4000-8000-000000000213";
const Nina = "00000000-0000-4000-8000-000000000214";
const Jade = "00000000-0000-4000-8000-000000000217";
const Ben = "00000000-0000-4000-8000-000000000218";

export const GOALS: Goal[] = [
  goal("301", Aisha, "Close books by working day 5", "Complete monthly close with zero material reconciling items.", "kra", 5, 4, "days", "approved"),
  goal("302", Aisha, "Forecast accuracy", "Keep rolling 3-month revenue forecast within 5% of actuals.", "kpi", 95, 91, "%", "approved"),
  goal("303", Aisha, "Automate variance commentary", "Ship a self-serve variance pack for department heads.", "okr", 100, 40, "%", "pending_approval"),
  goal("304", Marcus, "On-time statutory filings", "File all local returns before statutory deadlines.", "kra", 100, 100, "%", "completed"),
  goal("305", Marcus, "Reduce close journal rework", "Cut post-close correcting journals by 30%.", "kpi", 30, 18, "%", "approved"),
  goal("306", Elena, "Driver-based forecast model", "Replace spreadsheet forecast with driver-based model.", "okr", 100, 72, "%", "approved"),
  goal("307", Elena, "Budget cycle cycle-time", "Complete FY27 budget collection in 4 weeks.", "kpi", 4, 3, "weeks", "approved"),
  goal("308", Liam, "Platform uptime", "Maintain 99.9% availability for core APIs.", "kpi", 99.9, 99.95, "%", "approved"),
  goal("309", Liam, "CI pipeline duration", "Bring p95 CI runtime under 12 minutes.", "okr", 12, 14, "min", "approved"),
  goal("310", Maya, "Checkout conversion experiments", "Ship 4 A/B tests on checkout with documented learnings.", "okr", 4, 2, "tests", "approved"),
  goal("311", Maya, "Bug escape rate", "Keep Sev-1 production escapes at 0 per quarter.", "kpi", 0, 0, "incidents", "approved"),
  goal("312", Noah, "Endpoint MFA coverage", "Reach 100% MFA on privileged endpoints.", "kra", 100, 88, "%", "approved"),
  goal("313", Noah, "Vulnerability SLA", "Remediate critical CVEs within 7 days.", "kpi", 7, 5, "days", "pending_approval"),
  goal("314", Sam, "New ARR", "Close $480k in new ARR this half.", "kra", 480, 310, "k USD", "approved"),
  goal("315", Sam, "Win rate", "Hold qualified win rate at or above 32%.", "kpi", 32, 29, "%", "approved"),
  goal("316", Riley, "Qualified pipeline", "Source 90 SQLs per quarter.", "kpi", 90, 64, "SQLs", "approved"),
  goal("317", Nina, "Net revenue retention", "Deliver 112% NRR on the named book.", "kra", 112, 109, "%", "approved"),
  goal("318", Jade, "Organic sessions", "Grow organic sessions 25% vs prior half.", "kpi", 25, 17, "%", "approved"),
  goal("319", Jade, "Flagship campaign launch", "Launch the Q3 brand campaign on time with full asset kit.", "okr", 100, 100, "%", "completed"),
  goal("320", Ben, "MQL to SQL conversion", "Improve MQL→SQL conversion to 22%.", "kpi", 22, 18, "%", "approved"),
  goal("321", Ben, "Paid CAC efficiency", "Hold blended CAC under $420.", "kra", 420, 455, "USD", "rejected", "Recast the mix before approval — current CAC is moving the wrong way."),
];

function review(
  n: string,
  employeeId: string,
  managerId: string,
  cycleName: string,
  status: Review["status"],
  selfRating: number | null,
  selfComments: string | null,
  managerRating: number | null,
  managerComments: string | null,
  hrNotes: string | null = null,
): Review {
  return {
    id: `00000000-0000-4000-8000-000000000${n}`,
    employeeId,
    managerId,
    cycleName,
    selfRating,
    selfComments,
    managerRating,
    managerComments,
    hrNotes,
    status,
    createdAt: now,
    updatedAt: now,
  };
}

export const REVIEWS: Review[] = [
  review("401", Aisha, "00000000-0000-4000-8000-000000000202", "H2 2026 Mid-Year", "self_in_progress", 4, "Close is consistently on WD5. Forecast still has two noisy product lines.", null, null),
  review("402", Marcus, "00000000-0000-4000-8000-000000000202", "H2 2026 Mid-Year", "submitted", 4, "Filings were clean. Rework on journals is down but not at the 30% target yet.", null, null),
  review("403", Elena, "00000000-0000-4000-8000-000000000202", "H2 2026 Mid-Year", "manager_reviewed", 5, "Driver model is in UAT with two departments live.", 4, "Strong delivery. Stretch: socialize the model with Sales before year-end."),
  review("404", Liam, "00000000-0000-4000-8000-000000000207", "H2 2026 Mid-Year", "submitted", 4, "Uptime held. CI is still 2 minutes over the OKR.", null, null),
  review("405", Maya, "00000000-0000-4000-8000-000000000207", "H2 2026 Mid-Year", "finalized", 5, "Two experiments shipped; zero Sev-1s.", 5, "Excellent product sense and operational discipline.", "HR: Ready for senior engineer calibration next cycle."),
  review("406", Noah, "00000000-0000-4000-8000-000000000207", "H2 2026 Mid-Year", "not_started", null, null, null, null),
  review("407", Sam, "00000000-0000-4000-8000-000000000211", "H2 2026 Mid-Year", "submitted", 3, "Pipeline is healthy; two enterprise deals slipped a quarter.", null, null),
  review("408", Riley, "00000000-0000-4000-8000-000000000211", "H2 2026 Mid-Year", "self_in_progress", 3, "SQL volume is behind; quality of handoff has improved.", null, null),
  review("409", Jade, "00000000-0000-4000-8000-000000000216", "H2 2026 Mid-Year", "manager_reviewed", 4, "Campaign launched on time. Organic growth is tracking to plan.", 4, "Reliable operator. Next: own the measurement dashboard."),
  review("410", Ben, "00000000-0000-4000-8000-000000000216", "H2 2026 Mid-Year", "not_started", null, null, null, null),
];

function meeting(
  n: string,
  employeeId: string,
  managerId: string,
  title: string,
  scheduledAt: string,
  code: string,
): Meeting {
  return {
    id: `00000000-0000-4000-8000-000000000${n}`,
    employeeId,
    managerId,
    title,
    scheduledAt,
    durationMinutes: 45,
    meetUrl: `https://meet.google.com/${code}`,
    status: "scheduled",
    notes: "Mid-year 1-on-1",
    createdAt: now,
    updatedAt: now,
  };
}

export const MEETINGS: Meeting[] = [
  meeting("501", Aisha, "00000000-0000-4000-8000-000000000202", "Mid-year appraisal", "2026-09-04T14:00:00.000Z", "fin-aisha-k3m"),
  meeting("502", Liam, "00000000-0000-4000-8000-000000000207", "Mid-year appraisal", "2026-09-05T15:30:00.000Z", "it-liam-p9q"),
  meeting("503", Sam, "00000000-0000-4000-8000-000000000211", "Mid-year appraisal", "2026-09-08T16:00:00.000Z", "sal-sam-w2n"),
];

export const DEMO_PRESETS = [
  { label: "Employee · Aisha Rahman (Finance)", userId: Aisha },
  { label: "Manager · Sofia Patel (IT)", userId: "00000000-0000-4000-8000-000000000207" },
  { label: "HR · Priya Shah (Finance)", userId: "00000000-0000-4000-8000-000000000201" },
];
