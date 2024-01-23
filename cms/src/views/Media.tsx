import React from 'react';
import { Block, Button, useTranslations, Checkbox } from "@bdxtown/canaille";
import { IconUpload, IconTrash, IconBook2 } from '@tabler/icons-react';
import { Media as IMedia } from '../types/Media';
import { Modal } from '../bits/Modal';


import fr from './Media.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';

export const Location = {
    path: '/media',
}


const DeleteModal = ({ onCancel, media, onDelete }: { onCancel: React.MouseEventHandler, onDelete: React.MouseEventHandler, media: IMedia[] }) => {
    const { actions } = useAppContext();
    const { deleteMedia } = actions;
    const { T } = useTranslations('Media', {'fr-FR': fr});

    const onConfirm: React.MouseEventHandler = React.useCallback(async (e) => {
        // TODO: feedback
        const result = await Promise.all(media.map((m) => deleteMedia(m)));
        console.log(result);
        onDelete(e);
    }, [deleteMedia, media, onDelete]);

    return (
        <Modal className='bg-additional-primary'>
            <T>shouldDelete</T>
            <div className='mt-3 flex justify-between items-center gap-4'>
                <Button size={50} className='bg-red-500' onClick={onConfirm}>
                    <IconTrash /> <T>confirm</T>
                </Button>
                <Button size={50} onClick={onCancel}>
                    <IconBook2 /> <T>cancel</T>
                </Button>
            </div>
        </Modal>
    );
}

export const Media = () => {
    const input = React.useRef<HTMLInputElement>(null);
    const { T } = useTranslations('Media', {'fr-FR': fr });
    const [shouldDelete, setShouldDelete] = React.useState<IMedia[] | undefined>(undefined);

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

    const onDelete: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
        const form = e.currentTarget.form;
        const data = Array.from(new FormData(form as HTMLFormElement).keys());
        const cmedia = data.map((d) => media.find((m) => m.file === d)).filter((c) => !!c) as IMedia[];
        setShouldDelete(cmedia);
    }, [media]);

    return (
        <>
            <form className="grow flex flex-col gap-3 p-4">
                <div className='flex justify-between items-center'>
                    <div>
                        <input ref={input} className="hidden" type="file" onChange={onChange} />
                        <Button size={50} onClick={() => input.current?.click()}>
                            <IconUpload /> <T>upload</T>
                        </Button>
                    </div>
                    <Button className='hover:bg-red-500' size={50} variant="light" onClick={onDelete}><IconTrash /> <T>delete</T></Button>
                </div>
                <div className='flex gap-3 grow'>
                    {
                        media.map((m) => (
                            <Block key={m.url} className='relative h-[150px] w-[150px] bg-transparent text-center p-0 overflow-hidden'>
                                <label>
                                    <Checkbox className='absolute top-0 left-0 m-2' name={m.file} />
                                    {
                                        // TODO: add alt and description
                                    }
                                    <img className='h-full' src={m.url} alt={m.file} />
                                </label>
                            </Block>
                        ))
                    }
                </div>

            </form>
            {
                shouldDelete && <DeleteModal media={shouldDelete} onCancel={() => setShouldDelete(undefined)} onDelete={() => setShouldDelete(undefined)} />
            }
        </>
    )
};

