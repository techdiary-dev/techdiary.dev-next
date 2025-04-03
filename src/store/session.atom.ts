import { SessionResult } from "@/backend/services/action-type";
import { atom, useAtomValue } from "jotai";

export const sessionAtom = atom<SessionResult | null>(null);

sessionAtom.debugLabel = "session";

export const useSession = () => {
  return useAtomValue(sessionAtom);
};
