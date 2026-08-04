import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { AUTH_COOKIE } from "@/features/auth/const";
import { apiJiraUrl, authCookieHeader } from "@/lib/api-jira";
import { proxyRequest } from "@/lib/proxy-request";

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
    .get("/", sessionMiddleware, async (c) => {
        return proxyRequest(c, "/api/workspaces");
    })
    .patch("/:workspaceId", sessionMiddleware, async (c) => {
        const { workspaceId } = c.req.param();

        const formData = await c.req.formData();

        return proxyRequest(
            c,
            `/api/workspaces/${workspaceId}`,
            {
                method: "PATCH",
                body: formData,
            }
        );
    })
    .get(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const { workspaceId } = c.req.param();
            return proxyRequest(c, `/api/workspaces/${workspaceId}`, {
                method: "GET",
            });
        }
    )
    .delete("/:workspaceId", sessionMiddleware, async (c) => {
        const { workspaceId } = c.req.param();
        return proxyRequest(c, `/api/workspaces/${workspaceId}`, {
            method: "DELETE",
        });
    })
    .post(
        "/:workspaceId/reset-invite-code",
        sessionMiddleware,
        async (c) => {
            const { workspaceId } = c.req.param();

            return proxyRequest(
                c,
                `/api/workspaces/${workspaceId}/reset-invite-code`,
                {
                    method: "POST",
                }
            );
        }
    )


export default app;
