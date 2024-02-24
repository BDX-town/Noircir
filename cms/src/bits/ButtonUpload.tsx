import React from 'react';

import { Button } from '@bdxtown/canaille';
import { useAppContext } from '../data/AppContext';
import { IconUpload } from '@tabler/icons-react';
import { Media } from 'types/src/Media';
import { arrayBufferToWebP } from 'webp-converter-browser'

// eslint-disable-next-line react-refresh/only-export-components
export function useUpload() {
    const { actions } = useAppContext();
    const { putMedia } = actions;

    return React.useCallback(async (file: File) => {
        const webpBlob = await arrayBufferToWebP(await file.arrayBuffer(), { quality: parseFloat(import.meta.env.VITE_WEBP_QUALITY) })

        const media = await putMedia({
            file: `${file.name}.webp`,
            content: await webpBlob.arrayBuffer(),
            weight: webpBlob.size,
        } as unknown as Media);
        return media.url
    }, [putMedia]);
}

export const ButtonUpload = ({ children, onUpload, ...rest }: { className?: string, children: React.ReactNode, onUpload?: (f: File) => void }) => {
    const input = React.useRef<HTMLInputElement>(null);

    const upload = useUpload();

    const onChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(async (e) => {
        const file = (e.currentTarget.files as FileList)[0];
        await upload(file);
        if(onUpload) onUpload(file);
    }, [onUpload, upload]);

    return (
        <>
            <input ref={input} className="hidden" accept='image/*' type="file" onChange={onChange} />
            <Button {...rest} size={50} onClick={() => input.current?.click()}>
                <IconUpload /> { children }
            </Button>
        </>
    );
}