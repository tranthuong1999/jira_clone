import "server-only";

import { Account, Client, Users, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/features/auth/const";

export function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        account: new Account(client),
        users: new Users(client),
    };
}

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session?.value) {
        throw new Error("Unauthorized");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
    };
}