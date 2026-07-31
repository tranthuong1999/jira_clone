import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType =
    InferResponseType<
        typeof client.api.workspaces[":workspaceId"]["$patch"],
        200
    >;

type RequestType =
    InferRequestType<
        typeof client.api.workspaces[":workspaceId"]["$patch"]
    >;

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response =
                await client.api.workspaces[":workspaceId"]["$patch"]({
                    form,
                    param,
                });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Failed to update workspace");
            }

            return await response.json();
        },

        onSuccess: ({ data }) => {
            toast.success("Workspace updated");

            queryClient.invalidateQueries({
                queryKey: ["workspaces"],
            });

            queryClient.invalidateQueries({
                queryKey: ["workspace", data._id],
            });
        },

        onError: (error) => {
            toast.error(error.message || "Failed to update workspace");
        },
    });
};