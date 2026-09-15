import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { proxyRequest } from "@/lib/proxy-request";
import { createTaskSchema } from "../schemas";
import { TaskStatus } from "../types";

const listTasksQuerySchema = z.object({
    workspaceId: z.string(),
    projectId: z.string().nullish(),
    assigneeId: z.string().nullish(),
    status: z.nativeEnum(TaskStatus).nullish(),
    search: z.string().nullish(),
    dueDate: z.string().nullish(),
});

const bulkUpdateSchema = z.object({
    tasks: z.array(
        z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
        }),
    ),
});

const buildListQuery = (query: z.infer<typeof listTasksQuerySchema>) => {
    const params = new URLSearchParams({ workspaceId: query.workspaceId });

    if (query.projectId) params.set("projectId", query.projectId);
    if (query.assigneeId) params.set("assigneeId", query.assigneeId);
    if (query.status) params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.dueDate) params.set("dueDate", query.dueDate);

    return params.toString();
};

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", listTasksQuerySchema),
        async (c) => {
            const query = c.req.valid("query");

            return proxyRequest(c, `/api/tasks?${buildListQuery(query)}`);
        },
    )
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", createTaskSchema),
        async (c) => {
            const json = c.req.valid("json");

            return proxyRequest(c, "/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json),
            });
        },
    )
    .post(
        "/bulk-update",
        sessionMiddleware,
        zValidator("json", bulkUpdateSchema),
        async (c) => {
            const json = c.req.valid("json");

            return proxyRequest(c, "/api/tasks/bulk-update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json),
            });
        },
    )
    .get("/:taskId", sessionMiddleware, async (c) => {
        const { taskId } = c.req.param();

        return proxyRequest(c, `/api/tasks/${taskId}`);
    })
    .patch(
        "/:taskId",
        sessionMiddleware,
        zValidator("json", createTaskSchema.partial()),
        async (c) => {
            const { taskId } = c.req.param();
            const json = c.req.valid("json");

            return proxyRequest(c, `/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json),
            });
        },
    )
    .delete("/:taskId", sessionMiddleware, async (c) => {
        const { taskId } = c.req.param();

        return proxyRequest(c, `/api/tasks/${taskId}`, {
            method: "DELETE",
        });
    });

export default app;
