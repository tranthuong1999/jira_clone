import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { AUTH_COOKIE } from "@/features/auth/const";
import { apiJiraUrl, authCookieHeader } from "@/lib/api-jira";

const app = new Hono()
    .post(
        "/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const token = getCookie(c, AUTH_COOKIE);
            if (!token) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const { name, image } = c.req.valid("form");

            const formData = new FormData();
            formData.append("name", name);
            if (image instanceof File) {
                formData.append("image", image);
            }
            console.log({ formData })

            const response = await fetch(apiJiraUrl("/api/workspaces"), {
                method: "POST",
                headers: authCookieHeader(token),
                body: formData,
            });

            const body = await response.json().catch(() => ({
                message: "Failed to create workspace",
            }));

            return c.json(body, response.status as 200 | 201 | 400 | 401 | 500);
        },
    )
    .get(
        "/",
        sessionMiddleware,
        async (c) => {
            const token = getCookie(c, AUTH_COOKIE);

            if (!token) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const response = await fetch(apiJiraUrl("/api/workspaces"), {
                headers: authCookieHeader(token),
            });

            const body = await response.json();

            return c.json(
                body,
                response.status as 200 | 401 | 500
            );
        }
    );

export default app;
