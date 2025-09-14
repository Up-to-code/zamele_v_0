import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { useUserStore } from "../store/userStore";

export function useSyncUser() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const upsert = useMutation(api.users.upsertFromClerk);
  const convexUser = useQuery(api.users.getByClerkId, {
    clerkUserId: user?.id ?? "",
  });
  const {
    setUserType,
    setEmail,
    setName,
    setUniversity,
    setSection,
    setYear,
  } = useUserStore();
  const store = useUserStore();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const userType = (user.unsafeMetadata?.userType as "student" | "teacher") ?? (store.userType ?? "student");
    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const email = user.primaryEmailAddress?.emailAddress ?? "";
    const avatarUrl = user.imageUrl ?? undefined;

    upsert({
      clerkUserId: user.id,
      email,
      name: name || email,
      userType,
      universityId: store.universityId ?? undefined,
      sectionId: store.sectionId ?? undefined,
      year: store.year || undefined,
      avatarUrl,
    }).catch(() => {});
  }, [isSignedIn, user, upsert, store.userType, store.universityId, store.sectionId, store.year]);

  useEffect(() => {
    if (!convexUser) return;
    setUserType(convexUser.userType);
    setEmail(convexUser.email);
    setName(convexUser.name);
    if (convexUser.universityId) setUniversity(convexUser.universityId);
    if (convexUser.sectionId) setSection(convexUser.sectionId);
    if (convexUser.year) setYear(convexUser.year);
  }, [convexUser, setUserType, setEmail, setName, setUniversity, setSection, setYear]);
}


