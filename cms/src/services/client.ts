import { createClient } from "webdav";

const client = createClient(
    import.meta.env.VITE_PATH,
    {
        username: import.meta.env.VITE_USERNAME,
        password: import.meta.env.VITE_PASSWORD
    }
);

export {
    client
}