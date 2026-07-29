import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { Workspace } from "../type";

type GetWorkSpaceRespone = {
    data: Workspace[];
}

export const useGetWorkspaces = () => {
    const query = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await client.api.workspaces.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch workspaces");
            }

            const { data }: GetWorkSpaceRespone = await response.json() as GetWorkSpaceRespone;

            return data;
        },
    });

    return query;
};