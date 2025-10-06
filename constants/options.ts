// constants/options.ts
import { PickerOption } from "@/types";

/**
 * Year options for academic year selection
 */
export const YEAR_OPTIONS: PickerOption[] = [
  { label: "السنة الأولى", value: "1" },
  { label: "السنة الثانية", value: "2" },
  { label: "السنة الثالثة", value: "3" },
  { label: "السنة الرابعة", value: "4" },
  { label: "خريج", value: "5" },
];

/**
 * Plan options for subscription plan selection
 */
export const PLAN_OPTIONS: PickerOption[] = [
  { label: "مجاني", value: "free" },
  { label: "مميز", value: "pro" },
  { label: "الأقصى", value: "max" },
];

/**
 * User type options
 */
export const USER_TYPE_OPTIONS: PickerOption[] = [
  { label: "طالب", value: "student" },
  { label: "مدرس", value: "teacher" },
];

/**
 * Gender options
 */
export const GENDER_OPTIONS: PickerOption[] = [
  { label: "ذكر", value: "male" },
  { label: "أنثى", value: "female" },
];