import { createClient, type FileStat } from "webdav";

const client = createClient(
    import.meta.env.VITE_PATH,
    {
        username: import.meta.env.VITE_USERNAME,
        password: import.meta.env.VITE_PASSWORD
    }
);

export function getBlogContent(): Promise<FileStat[]> {
    // TODO: can be cached here to avoid retrieveing unmodified content 
    return client.getDirectoryContents("/") as Promise<FileStat[]>
}

export {
    client
}