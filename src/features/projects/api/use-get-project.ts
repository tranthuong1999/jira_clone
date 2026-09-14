import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectProps {
    projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const response = await client.api.projects[":projectId"].$get({
                param: { projectId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch project");
            }

            const { data } = await response.json();

            return data;
        },
    });
};

interface UseGetProjectAnalyticsProps {
    projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<
    (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
    200
>["data"];

export const useGetProjectAnalytics = ({
    projectId,
}: UseGetProjectAnalyticsProps) => {
    return useQuery({
        queryKey: ["project-analytics", projectId],
        queryFn: async () => {
            const response = await client.api.projects[":projectId"][
                "analytics"
            ].$get({
                param: { projectId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch project analytics");
            }

            const { data } = await response.json();

            return data;
        },
    });
};
