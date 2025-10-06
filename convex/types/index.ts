import { Id } from "../_generated/dataModel";

 
export type UserType = "student" | "teacher";
export type PlanType = "free" | "pro" | "max";

export interface University {
  _id: Id<"universities">;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: number;
}

export interface Section {
  _id: Id<"sections">;
  name: string;
  description?: string;
  universityId?: Id<"universities">;
  isActive: boolean;
  createdAt: number;
}

export interface FormData {
  name: string;
  userType: UserType;
  universityId: string | null;
  sectionId: string | null;
  year: string;
  isVerified: boolean;
  plan: PlanType;
}

export interface PickerOption {
  label: string;
  value: string;
}