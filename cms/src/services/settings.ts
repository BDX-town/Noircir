import { WebdavClient } from "../types/webdav";
import { buildUrl } from "../helpers/buildUrl";

async function generatePassword(client: WebdavClient, password: string): Promise<string> {
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

export async function changePassword(client: WebdavClient, password: string): Promise<boolean> {
    const hashedPassword = await generatePassword(client, password);
    const source = (`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/.auth.allow`);
    const destination = (`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/.auth.allow.backup`);
    // initial destination header is malformed 
    await client.copyFile(source, destination, { headers: { "Destination": destination }});
    return client.putFileContents(source, `${client.username}:${hashedPassword}`, { overwrite: true }) as boolean
}