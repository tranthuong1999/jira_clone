import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";


export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workspaceId: string) => {
            const response =
                await client.api.workspaces[":workspaceId"].$delete({
                    param: {
                        workspaceId,
                    },
                });

            if (!response.ok) {
                throw new Error("Failed");
            }

            return await response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workspaces"],
            });
        },
    });
};