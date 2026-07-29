import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

const Home = async () => {
    const user = await getCurrent();

    if (!user) {
        redirect("/sign-in");
    }

    const workspaces = await getWorkspaces();

    if (!workspaces?.length) {
        redirect("/workspaces/create");
        return;
    }

    redirect(`/workspaces/${workspaces[0]._id}`);
};

export default Home;