// lib/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = "student" | "teacher";

export interface UserState {
  // User data
  clerkUserId: string;
  name: string;
  email: string;
  userType: UserType;
  universityId: string | null;
  sectionId: string | null;
  year: string;
  avatarUrl: string | null;
  avatarStorageId: string | null; // Add this field
  canComment: boolean;
  canCreateCommunity: boolean;
  isVerified: boolean;
  plan: "free" | "pro" | "max";
  points: number;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  lastLoginAt: number;

  // Actions
  setClerkUserId: (id: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setUserType: (type: UserType) => void;
  setUniversity: (universityId: string) => void;
  setSection: (sectionId: string) => void;
  setYear: (year: string) => void;
  setAvatarUrl: (url: string | null) => void;
  setAvatarStorageId: (storageId: string | null) => void; // Add this method
  setCanComment: (canComment: boolean) => void;
  setCanCreateCommunity: (canCreateCommunity: boolean) => void;
  setIsVerified: (isVerified: boolean) => void;
  setPlan: (plan: "free" | "pro" | "max") => void;
  setPoints: (points: number) => void;
  addPoints: (points: number) => void;
  subtractPoints: (points: number) => void;
  updateLastLogin: () => void;
  clearUser: () => void;
  
  // Computed properties
  isTeacher: boolean;
  isStudent: boolean;
  isPremium: boolean;
}

const initialState = {
  clerkUserId: "",
  name: "",
  email: "",
  userType: "student" as UserType,
  universityId: null,
  sectionId: null,
  year: "",
  avatarUrl: null,
  avatarStorageId: null,
  canComment: true,
  canCreateCommunity: false,
  isVerified: false,
  plan: "free" as const,
  points: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastLoginAt: Date.now(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Computed properties
      get isTeacher() {
        return get().userType === "teacher";
      },
      get isStudent() {
        return get().userType === "student";
      },
      get isPremium() {
        const plan = get().plan;
        return plan === "pro" || plan === "max";
      },

      // Actions
      setClerkUserId: (clerkUserId) =>
        set({ clerkUserId, updatedAt: Date.now() }),

      setName: (name) =>
        set({ name, updatedAt: Date.now() }),

      setEmail: (email) =>
        set({ email, updatedAt: Date.now() }),

      setUserType: (userType) =>
        set({ userType, updatedAt: Date.now() }),

      setUniversity: (universityId) =>
        set({ universityId, updatedAt: Date.now() }),

      setSection: (sectionId) =>
        set({ sectionId, updatedAt: Date.now() }),

      setYear: (year) =>
        set({ year, updatedAt: Date.now() }),

      setAvatarUrl: (avatarUrl) =>
        set({ avatarUrl, updatedAt: Date.now() }),

      setAvatarStorageId: (avatarStorageId) =>
        set({ avatarStorageId, updatedAt: Date.now() }),

      setCanComment: (canComment) =>
        set({ canComment, updatedAt: Date.now() }),

      setCanCreateCommunity: (canCreateCommunity) =>
        set({ canCreateCommunity, updatedAt: Date.now() }),

      setIsVerified: (isVerified) =>
        set({ isVerified, updatedAt: Date.now() }),

      setPlan: (plan) =>
        set({ plan, updatedAt: Date.now() }),

      setPoints: (points) =>
        set({ points, updatedAt: Date.now() }),

      addPoints: (points) =>
        set((state) => ({
          points: state.points + points,
          updatedAt: Date.now()
        })),

      subtractPoints: (points) =>
        set((state) => ({
          points: Math.max(0, state.points - points),
          updatedAt: Date.now()
        })),

      updateLastLogin: () =>
        set({ lastLoginAt: Date.now(), updatedAt: Date.now() }),

      clearUser: () =>
        set({
          ...initialState,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastLoginAt: Date.now(),
        }),
    }),
    {
      name: 'user-storage',
      // Only persist essential data
      partialize: (state) => ({
        clerkUserId: state.clerkUserId,
        name: state.name,
        email: state.email,
        userType: state.userType,
        universityId: state.universityId,
        sectionId: state.sectionId,
        year: state.year,
        avatarUrl: state.avatarUrl,
        avatarStorageId: state.avatarStorageId,
        canComment: state.canComment,
        canCreateCommunity: state.canCreateCommunity,
        isVerified: state.isVerified,
        plan: state.plan,
        points: state.points,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
        lastLoginAt: state.lastLoginAt,
      }),
    }
  )
);