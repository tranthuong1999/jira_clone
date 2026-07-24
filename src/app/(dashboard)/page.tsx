import { UserButton } from "@/features/auth/components/user-button";
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const Home = async () => {
    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    return (
        <div>
            This is home page
        </div>
    )
}

export default Home
