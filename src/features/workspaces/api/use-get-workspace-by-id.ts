import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { Workspace } from "../type";

type GetWorkspaceResponse = {
    data: Workspace;
};

export const useGetWorkspaceById = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],

        enabled: !!workspaceId,

        queryFn: async () => {
            const response =
                await client.api.workspaces[":workspaceId"].$get({
                    param: {
                        workspaceId,
                    },
                });

            if (!response.ok) {
                throw new Error("Failed to fetch workspace");
            }

            const { data }: GetWorkspaceResponse = await response.json() as GetWorkspaceResponse;

            return data;
        },
    });
};