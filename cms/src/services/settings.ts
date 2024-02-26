import { WebdavClient } from "../types/webdav";
import { buildUrl } from "../helpers/buildUrl";

export async function generatePassword(client: WebdavClient, password: string): Promise<string> {
    const url = buildUrl(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/password`);
    const request = await fetch(url, { 
        method: 'post', 
        headers: new Headers({
            'Authorization': 'Basic '+btoa(`${client.username}:${client.password}`), 
            'Content-Type': 'text/plain'
        }), 
        body: password
    });
    return request.text();
}