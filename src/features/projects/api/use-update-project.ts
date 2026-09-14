import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
    (typeof client.api.projects)[":projectId"]["$patch"],
    200
>;
type RequestType = InferRequestType<
    (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, form }) => {
            const response = await client.api.projects[":projectId"]["$patch"]({
                param,
                form,
            });

            if (!response.ok) {
                throw new Error("Failed to update project");
            }

            return await response.json();
        },
        onSuccess: (_data, variables) => {
            toast.success("Project updated");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({
                queryKey: ["project", variables.param.projectId],
            });
        },
        onError: () => {
            toast.error("Failed to update project");
        },
    });
};
