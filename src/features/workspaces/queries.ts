import { client } from "@/lib/rpc";
import { Workspace } from "./type";

export interface GetWorkspacesResponse {
    data: Workspace[];
}

export const getWorkspaces = async () => {
    const response = await client.api.workspaces.$get();

    const { data }: GetWorkspacesResponse = await response.json() as GetWorkspacesResponse;

    return data;
};