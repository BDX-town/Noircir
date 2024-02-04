import React from 'react';

import { Button } from '@bdxtown/canaille';
import { useAppContext } from '../data/AppContext';
import { IconUpload } from '@tabler/icons-react';
import { Media } from './../types/Media';

// eslint-disable-next-line react-refresh/only-export-components
export function useUpload() {
    const { actions } = useAppContext();
    const { putMedia } = actions;

    return React.useCallback(async (file: File) => {
        const media = await putMedia({
            file: file.name,
            content: await file.arrayBuffer(),
            weight: file.size,
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
            <input ref={input} className="hidden" type="file" onChange={onChange} />
            <Button {...rest} size={50} onClick={() => input.current?.click()}>
                <IconUpload /> { children }
            </Button>
        </>
    );
}