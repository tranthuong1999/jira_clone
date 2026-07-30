import { client } from "@/lib/rpc";
import { Workspace } from "./type";
import { cookies } from "next/headers";

export interface GetWorkspacesResponse {
    data: Workspace[];
}
export const getWorkspaces = async () => {
    const cookieStore = await cookies();

    const response = await client.api.workspaces.$get(
        {},
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
    }

    const { data }: GetWorkspacesResponse = await response.json() as GetWorkspacesResponse;

    return data;
};