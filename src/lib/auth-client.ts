import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();

export type IAuthSession = typeof authClient.$Infer.Session;
