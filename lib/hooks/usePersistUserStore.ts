import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../../convex/_generated/api";
import { useUserStore } from "../store/userStore";

type PersistPayload = {
  universityId: string | null;
  sectionId: string | null;
  year: string;
  name: string;
  userType: "student" | "teacher" | null;
};

function isEqual(a: PersistPayload, b: PersistPayload) {
  return (
    a.universityId === b.universityId &&
    a.sectionId === b.sectionId &&
    a.year === b.year &&
    a.name === b.name &&
    a.userType === b.userType
  );
}

export function usePersistUserStore() {
  const { user } = useUser();
  const update = useMutation(api.users.updateProfileFields);
  const getState = useUserStore;
  const lastSentRef = useRef<PersistPayload | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = getState.subscribe((state) => {
      const snapshot: PersistPayload = {
        universityId: state.universityId,
        sectionId: state.sectionId,
        year: state.year,
        name: state.name,
        userType: state.userType,
      };

      if (!user?.id) return;

      if (lastSentRef.current && isEqual(lastSentRef.current, snapshot)) {
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        lastSentRef.current = snapshot;
        update({
          clerkUserId: user.id,
          universityId: snapshot.universityId ?? undefined,
          sectionId: snapshot.sectionId ?? undefined,
          year: snapshot.year || undefined,
          name: snapshot.name || undefined,
          userType: snapshot.userType ?? undefined,
        }).catch(() => {});
      }, 500);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      unsubscribe();
    };
  }, [getState, update, user?.id]);
}


