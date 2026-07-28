import "server-only";

const getApiBaseUrl = () => {
    const url = process.env.API_JIRA_URL ?? process.env.NEXT_PUBLIC_API_JIRA_URL;
    if (!url) {
        throw new Error("API_JIRA_URL is not defined");
    }
    return url.replace(/\/$/, "");
};

export const apiJiraUrl = (path: string) => `${getApiBaseUrl()}${path}`;

export const parseJwtFromSetCookie = (setCookieHeader: string | null): string | null => {
    if (!setCookieHeader) {
        return null;
    }

    const match = setCookieHeader.match(/(?:^|,\s*)jwt=([^;]+)/);
    return match?.[1] ?? null;
};

export const extractJwtFromResponse = (response: Response): string | null => {
    if (typeof response.headers.getSetCookie === "function") {
        for (const cookie of response.headers.getSetCookie()) {
            const token = parseJwtFromSetCookie(cookie);
            if (token) {
                return token;
            }
        }
    }

    return parseJwtFromSetCookie(response.headers.get("set-cookie"));
};

export const authCookieHeader = (token: string) => ({
    Cookie: `jwt=${token}`,
});
