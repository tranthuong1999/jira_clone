import type { Context } from "hono";
import { getCookie } from "hono/cookie";

import { AUTH_COOKIE } from "@/features/auth/const";
import { apiJiraUrl, authCookieHeader } from "./api-jira";

export const proxyRequest = async (
    c: Context,
    path: string,
    init?: RequestInit
) => {
    const token = getCookie(c, AUTH_COOKIE);

    if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const response = await fetch(apiJiraUrl(path), {
        ...init,
        headers: {
            ...authCookieHeader(token),
            ...(init?.headers ?? {}),
        },
    });

    const body = await response.json().catch(() => ({
        message: "Request failed",
    }));

    return c.json(body, response.status as 200 | 201 | 400 | 401 | 403 | 404 | 500);
};