"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspace";
import { WorkspaceAvatar } from "./workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { Workspace } from "@/features/workspaces/type";


export const WorkSpaceSwitcher = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const { data: workspaces } = useGetWorkspaces();
    const { open } = useCreateWorkspaceModal();

    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`);
    };

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
            </div>
            <Select value={workspaceId} onValueChange={onSelect}>
                <SelectTrigger>
                    <SelectValue placeholder="No workspace selected" />
                </SelectTrigger>

                <SelectContent>
                    {!!workspaces?.length && workspaces?.map((workspace: Workspace) => {
                        return (
                            <SelectItem
                                key={workspace._id}
                                value={workspace._id}
                            >
                                <div className="flex items-center gap-3">
                                    <WorkspaceAvatar
                                        name={workspace.name}
                                        image={workspace?.image?.url}
                                    />
                                    <span>{workspace.name}</span>
                                </div>
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};
