import { IUser } from "@/http/models/User.model";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<IUser | null>("current-user", null);
