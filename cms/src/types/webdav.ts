/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WebdavFile {
    filename: string,
    basename: string,
    lastmod: string,
    size: number,
    file: string,
}

export interface WebdavClient {
    username: string,
    password: string,

    copyFile: (...a: any) => any,
    createDirectory: (...a: any) => any,
    createReadStream: (...a: any) => any,
    createWriteStream: (...a: any) => any,
    customRequest: (...a: any) => any,
    deleteFile: (...a: any) => any,
    exists: (...a: any) => any,
    getDirectoryContents: (...a: any) => any,
    getFileContents: (...a: any) => any,
    getFileDownloadLink: (...a: any) => any,
    getFileUploadLink: (...a: any) => any,
    getHeaders: (...a: any) => any,
    getQuota: (...a: any) => any,
    lock: (...a: any) => any,
    moveFile: (...a: any) => any,
    putFileContents: (...a: any) => any,
    search: (...a: any) => any,
    setHeaders: (...a: any) => any,
    stat: (...a: any) => any,
    unlock: (...a: any) => any
}
