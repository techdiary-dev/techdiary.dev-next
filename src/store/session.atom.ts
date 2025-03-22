import { SessionResult } from "@/auth/auth";
import { atom, useAtomValue } from "jotai";

export const sessionAtom = atom<SessionResult | null>(null);

sessionAtom.debugLabel = "session";

export const useSession = () => {
  return useAtomValue(sessionAtom);
};
