import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/const";
import { apiJiraUrl, authCookieHeader } from "@/lib/api-jira";

export type ApiUser = {
    _id: string;
    name: string;
    email: string;
    avatar?: {
        url: string;
        publicId: string;
    };
};

type AdditionalContext = {
    Variables: {
        user: ApiUser;
    };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const session = getCookie(c, AUTH_COOKIE);

        if (!session) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const response = await fetch(apiJiraUrl("/api/auth/me"), {
            headers: authCookieHeader(session),
            cache: "no-store",
        });

        if (!response.ok) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const user = (await response.json()) as ApiUser;
        c.set("user", user);

        await next();
    },
);
