import "server-only";

import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./const";
import { apiJiraUrl, authCookieHeader } from "@/lib/api-jira";
import type { ApiUser } from "@/lib/session-middleware";

export const getCurrent = async (): Promise<ApiUser | null> => {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(AUTH_COOKIE);

        if (!session?.value) {
            return null;
        }

        const response = await fetch(apiJiraUrl("/api/auth/me"), {
            headers: authCookieHeader(session.value),
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as ApiUser;
    } catch {
        return null;
    }
};
