import { WebdavClient } from "../types/webdav";
import { buildUrl } from "../helpers/buildUrl";
import { AppError, declareError } from "../data/AppError";
import { fetchAdapter } from "./fetch";

export const GENERATE_PASSWORD_FAIL = declareError('Unable to generate a password. There is maybe something wrong on our side, but please check your connection.');
export const GENERATE_PASSWORD_DENY = declareError('You do not have the right to ask for a password. Please check your credentials.');
export const GENERATE_PASSWORD_NOTFOUND = declareError('Unable to generate a password. Server\'s configuration is wrong. Please tell your administrator about this issue.');
async function generatePassword(client: WebdavClient, password: string): Promise<string> {
    const url = buildUrl(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/password`);
    let response;
    try {
        response = await fetch(url, { 
            method: 'post', 
            headers: new Headers({
                'Authorization': 'Basic '+btoa(`${client.username}:${client.password}`), 
                'Content-Type': 'text/plain'
            }), 
            body: password
        });
    } catch (e) {
        throw new AppError(GENERATE_PASSWORD_FAIL, (e as object).toString());
    }
    if(!response.ok) {
        let code = GENERATE_PASSWORD_FAIL;
        if(response.status === 401 || response.status === 403) code = GENERATE_PASSWORD_DENY;
        else if(response.status === 404) code = GENERATE_PASSWORD_NOTFOUND;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
    return response.text();
}

export const CHANGE_PASSWORD_FAIL = declareError('Unable to change your password. There is maybe something wrong on our side, but please check your connection.');
export const CHANGE_PASSWORD_DENY = declareError('You do not have the right to change password. Please check your credentials.');
export const CHANGE_PASSWORD_NOTFOUND = declareError('Unable to generate a password. Server\'s configuration is wrong. Please tell your administrator about this issue.');
export const CHANGE_PASSWORD_FALSE = declareError('Unable to save your new password. There is something wrong with the server\'s configuration. Please tell your adminitrator about that issue.');
export async function changePassword(client: WebdavClient, password: string): Promise<void> {
    const hashedPassword = await generatePassword(client, password);
    const source = (`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/.auth.allow`);
    const destination = (`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/.auth.allow.backup`);
    // initial destination header is malformed 
    let response;

    try {
        response = await fetchAdapter(client.deleteFile, destination);
    } catch (e) {
        throw new AppError(CHANGE_PASSWORD_FAIL, (e as object).toString());
    }
    if(!response.ok && response.status !== 404) {
        let code = CHANGE_PASSWORD_FAIL;
        if(response.status === 401 || response.status === 403) code = CHANGE_PASSWORD_DENY;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }
    
    try {
        response = await fetchAdapter(client.copyFile, source, destination, { headers: { "Destination": destination }});
    } catch (e) {
        throw new AppError(CHANGE_PASSWORD_FAIL, (e as object).toString());
    }
    if(!response.ok) {
        let code = CHANGE_PASSWORD_FAIL;
        if(response.status === 401 || response.status === 403) code = CHANGE_PASSWORD_DENY;
        else if(response.status === 404) code = CHANGE_PASSWORD_NOTFOUND;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }

    try {
        response = await fetchAdapter(client.putFileContents, source, `${client.username}:${hashedPassword}`, { overwrite: true });
    } catch (e) {
        throw new AppError(CHANGE_PASSWORD_FAIL, (e as object).toString());
    }
    if(!response.ok) {
        let code = CHANGE_PASSWORD_FAIL;
        if(response.status === 401 || response.status === 403) code = CHANGE_PASSWORD_DENY;
        else if(response.status === 404) code = CHANGE_PASSWORD_NOTFOUND;
        throw new AppError(code, `${response.status}: ${response.statusText}`);
    }

    let result = false;
    try {
        result = await response.json();
    } catch (e) {
        throw new AppError(CHANGE_PASSWORD_FAIL, (e as object).toString());
    }
    if(!result) throw new AppError(CHANGE_PASSWORD_FALSE, 'putFileContents returned false. This should not happen with overwrite: true')
}