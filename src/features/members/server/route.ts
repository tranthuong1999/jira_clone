import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { proxyRequest } from "@/lib/proxy-request";
import { updateMemberSchema } from "../schemas";

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const { workspaceId } = c.req.valid("query");

            return proxyRequest(
                c,
                `/api/members?workspaceId=${encodeURIComponent(workspaceId)}`,
            );
        },
    )
    .delete("/:memberId", sessionMiddleware, async (c) => {
        const { memberId } = c.req.param();

        return proxyRequest(c, `/api/members/${memberId}`, {
            method: "DELETE",
        });
    })
    .patch(
        "/:memberId",
        sessionMiddleware,
        zValidator("json", updateMemberSchema),
        async (c) => {
            const { memberId } = c.req.param();
            const json = c.req.valid("json");

            return proxyRequest(c, `/api/members/${memberId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json),
            });
        },
    );

export default app;
