import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

const Home = async () => {
    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    return (
        <div>
            <CreateWorkspaceForm />
        </div>
    )
}

export default Home
