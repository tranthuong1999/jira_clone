import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { proxyRequest } from "@/lib/proxy-request";
import { createProjectSchema, updateProjectSchema } from "../schemas";

const buildProjectFormData = (
    fields: Record<string, string | File | undefined>,
) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === "") {
            continue;
        }

        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, value);
        }
    }

    return formData;
};

const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("form", createProjectSchema),
        async (c) => {
            const { name, workspaceId, image } = c.req.valid("form");

            return proxyRequest(c, "/api/projects", {
                method: "POST",
                body: buildProjectFormData({
                    name,
                    workspaceId,
                    image: image instanceof File ? image : undefined,
                }),
            });
        },
    )
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const { workspaceId } = c.req.valid("query");

            return proxyRequest(
                c,
                `/api/projects?workspaceId=${encodeURIComponent(workspaceId)}`,
            );
        },
    )
    .get("/:projectId/analytics", sessionMiddleware, async (c) => {
        const { projectId } = c.req.param();

        return proxyRequest(c, `/api/projects/${projectId}/analytics`);
    })
    .get("/:projectId", sessionMiddleware, async (c) => {
        const { projectId } = c.req.param();

        return proxyRequest(c, `/api/projects/${projectId}`);
    })
    .patch(
        "/:projectId",
        sessionMiddleware,
        zValidator("form", updateProjectSchema),
        async (c) => {
            const { projectId } = c.req.param();
            const { name, image } = c.req.valid("form");

            return proxyRequest(c, `/api/projects/${projectId}`, {
                method: "PATCH",
                body: buildProjectFormData({
                    name,
                    image:
                        image instanceof File
                            ? image
                            : typeof image === "string"
                              ? image
                              : undefined,
                }),
            });
        },
    )
    .delete("/:projectId", sessionMiddleware, async (c) => {
        const { projectId } = c.req.param();

        return proxyRequest(c, `/api/projects/${projectId}`, {
            method: "DELETE",
        });
    });

export default app;
