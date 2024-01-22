import React from 'react';
import { Block, Button, useTranslations } from "@bdxtown/canaille";
import { IconUpload } from '@tabler/icons-react';
import { Media as IMedia } from '../types/Media';

import fr from './Media.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';

export const Location = {
    path: '/media',
}

export const Media = () => {
    const input = React.useRef<HTMLInputElement>(null);
    const { T } = useTranslations('Media', {'fr-FR': fr });

    const { actions, media } = useAppContext();
    const { putMedia } = actions;

    const onChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(async (e) => {
        const file = (e.currentTarget.files as FileList)[0]
        await putMedia({
            file: file.name,
            content: await file.arrayBuffer(),
            weight: file.size,
        } as unknown as IMedia)
    }, [putMedia]);

    const images = React.useMemo(() => {
        return media.map((m) => {
            console.log(m.content);
            const arrayBufferView = new Uint8Array(m.content);
            const blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
            console.log(blob);
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL( blob );
            return imageUrl;
        })
    }, [media]);

    return (
        <div className="grow flex flex-col  p-4">
            <div className='flex gap-3 grow'>
                {images.map((i) => <button className='bg-transparent border-none h-[150px] w-[150px]'><Block className='h-[150px] w-[150px] bg-transparent  text-center p-0 overflow-hidden'><img className='h-full' src={i} /></Block></button>)}
            </div>
            <div className="text-right">
                <input ref={input} className="hidden" type="file" onChange={onChange} />
                <Button onClick={() => input.current?.click()}>
                    <IconUpload /> <T>upload</T>
                </Button>
            </div>
        </div>
    )
};

