import { DEPARTMENTS, GOALS, MEETINGS, REVIEWS, USERS } from "@/lib/seed-data";
import type { DirectoryUser, Goal, Meeting, Review } from "@/lib/types";

type Store = {
  users: DirectoryUser[];
  goals: Goal[];
  reviews: Review[];
  meetings: Meeting[];
};

const g = globalThis as unknown as { __pmsStore?: Store };

function cloneStore(): Store {
  return {
    users: structuredClone(USERS),
    goals: structuredClone(GOALS),
    reviews: structuredClone(REVIEWS),
    meetings: structuredClone(MEETINGS),
  };
}

export function getDemoStore(): Store {
  if (!g.__pmsStore) g.__pmsStore = cloneStore();
  return g.__pmsStore;
}

export function departments() {
  return DEPARTMENTS;
}
