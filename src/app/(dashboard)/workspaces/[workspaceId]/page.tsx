import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation';

const WorkspaceId = async ({ params }: {
    params: Promise<{ workspaceId: string }>;
}) => {

    const user = await getCurrent();
    const { workspaceId } = await params;

    if (!user) redirect("/sign-in")

    return (
        <div>
            Workspace Id {workspaceId}
        </div>
    )
}

export default WorkspaceId
