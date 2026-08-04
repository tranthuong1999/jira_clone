import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useResetInviteCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workspaceId: string) => {
            const response =
                await client.api.workspaces[":workspaceId"]["reset-invite-code"].$post({
                    param: {
                        workspaceId,
                    },
                });

            if (!response.ok) {
                throw new Error("Failed to reset invite code");
            }

            return await response.json();
        },

        onSuccess: (_, workspaceId) => {
            queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });

            queryClient.invalidateQueries({
                queryKey: ["workspaces"],
            });
        },
    });
};