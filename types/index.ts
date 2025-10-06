// types/index.ts
/**
 * University interface matching Convex schema
 */
export interface University {
    _id: string;
    nameAr: string;
    nameEn?: string;
    code: string;
    city?: string;
    country?: string;
    logoStorageId?: string;
    description?: string;
    website?: string;
    isActive?: boolean;
    createdAt: number;
    updatedAt: number;
  }
  
  /**
   * Section interface matching Convex schema
   */
  export interface Section {
    _id: string;
    nameAr: string;
    nameEn?: string;
    code: string;
    universityId: string;
    description?: string;
    isActive?: boolean;
    createdAt: number;
    updatedAt: number;
  }
  
  /**
   * Form data interface for user profile
   */
  export interface FormData {
    name: string;
    userType: "student" | "teacher";
    universityId?: string | null;
    sectionId?: string | null;
    year: string;
    isVerified: boolean;
    plan: "free" | "pro" | "max";
  }
  
  /**
   * User type union
   */
  export type UserType = "student" | "teacher";
  
  /**
   * Plan type union
   */
  export type PlanType = "free" | "pro" | "max";
  
  /**
   * Picker option interface
   */
  export interface PickerOption {
    label: string;
    value: string;
  }
  
  /**
   * API response interface
   */
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  /**
   * Navigation types
   */
  export type NavigationScreen = 
    | "home"
    | "profile"
    | "settings"
    | "edit-account"
    | "universities"
    | "sections"
    | "courses"
    | "events";