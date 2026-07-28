import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schemas";
import { AUTH_COOKIE } from "../const";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
    apiJiraUrl,
    authCookieHeader,
    extractJwtFromResponse,
} from "@/lib/api-jira";

const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7,
};

const app = new Hono()
    .get("/current", sessionMiddleware, (c) => {
        const user = c.get("user");
        return c.json({ data: user });
    })
    .post("/login", zValidator("json", loginSchema), async (c) => {
        const { email, password } = c.req.valid("json");

        const response = await fetch(apiJiraUrl("/api/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const token = extractJwtFromResponse(response);
        if (!token) {
            return c.json({ error: "Failed to establish session" }, 500);
        }

        setCookie(c, AUTH_COOKIE, token, cookieOptions);

        return c.json({ success: true });
    })
    .post("/register", zValidator("json", registerSchema), async (c) => {
        const { name, email, password } = c.req.valid("json");

        const response = await fetch(apiJiraUrl("/api/auth/sign-up"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const body = (await response.json().catch(() => null)) as
                | { message?: string }
                | null;
            return c.json(
                { error: body?.message ?? "Failed to register" },
                400,
            );
        }

        const token = extractJwtFromResponse(response);
        if (!token) {
            return c.json({ error: "Failed to establish session" }, 500);
        }

        setCookie(c, AUTH_COOKIE, token, cookieOptions);

        return c.json({ success: true });
    })
    .post("/logout", sessionMiddleware, async (c) => {
        const token = getCookie(c, AUTH_COOKIE);

        if (token) {
            await fetch(apiJiraUrl("/api/auth/logout"), {
                method: "POST",
                headers: authCookieHeader(token),
            }).catch(() => undefined);
        }

        deleteCookie(c, AUTH_COOKIE);

        return c.json({ success: true });
    });

export default app;
