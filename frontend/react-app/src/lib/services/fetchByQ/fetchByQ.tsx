import { User } from "@auth0/auth0-react";
import SessionStorageService from "services/SessionStorageService";
import { SessionStorageField } from "services/SessionStorageService/SessionStorageService";

async function fetchByQ(route?: string, options?: Record<string, any>): Promise<Response>
async function fetchByQ(route = "", options = {}) {
    let user: User;
    let accessToken: string;
    try {
        user = JSON.parse(SessionStorageService.getItem(SessionStorageField.User) || '');
        accessToken = SessionStorageService.getItem(SessionStorageField.AccessToken) || '';
    } catch (e: any) {
        throw new Error(e);
    }
    
    const userId = user.sub;

    return fetch(`/api/${userId}/${route}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...((options as { headers: any })?.headers instanceof Object
                ? (options as { headers: any })
                : {}),
        }
    })
}

export default fetchByQ