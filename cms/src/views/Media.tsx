import React from 'react';
import { Block, Button, useTranslations, Checkbox } from "@bdxtown/canaille";
import { IconTrash, IconBook2, IconDownload } from '@tabler/icons-react';
import { Media as IMedia } from '../types/Media';
import { Modal } from '../bits/Modal';


import fr from './Media.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { ButtonUpload } from '../bits/ButtonUpload';
import { weight } from '../helpers/weight';

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
        <Modal className='bg-additional-primary' onClose={onDelete}>
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
    const { T } = useTranslations('Media', {'fr-FR': fr });
    const [shouldDelete, setShouldDelete] = React.useState<IMedia[] | undefined>(undefined);

    const { media } = useAppContext();


    const onDelete: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
        const form = e.currentTarget.form;
        const data = Array.from(new FormData(form as HTMLFormElement).keys());
        const cmedia = data.map((d) => media.find((m) => m.file === d)).filter((c) => !!c) as IMedia[];
        setShouldDelete(cmedia);
    }, [media]);

    return (
        <>
            <form className="grow flex flex-col gap-3 p-4 pb-2">
                <div className='flex gap-3 flex-wrap'>
                    {
                        media.map((m) => (
                            <Block key={m.url} className='relative h-[150px] w-[150px] bg-transparent text-center p-0 overflow-hidden shrink-0'>
                                <label>
                                    {
                                        // TODO: add alt and description
                                    }
                                    <img className='h-full' src={m.url} alt={m.file} />
                                    <div className='absolute opacity-50 top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent via-transparent via-transparent to-gray-900' />
                                    <Checkbox className='absolute top-0 left-0 m-2' name={m.file} />
                                    <div className='absolute bottom-0 w-full text-white flex justify-between items-center'>
                                        <a href={m.url} target="_blank" type="button" className='p-1 text-white'><IconDownload /></a>
                                        <span className='p-1'>{weight(m.weight)}</span>
                                    </div>
                                </label>
                            </Block>
                        ))
                    }
                </div>
                <div className='grow'></div>
                <div className='flex justify-between gap-2 items-center sticky bottom-0 py-2 bg-additional-primary'>
                    <Button className='hover:bg-red-500' size={50} variant="light" onClick={onDelete}><IconTrash /> <T>delete</T></Button>
                    <span className='text-gray-800 text-sm'><T number={media.length}>number</T></span>
                    <ButtonUpload><T>upload</T></ButtonUpload>
                </div>

            </form>
            {
                shouldDelete && <DeleteModal media={shouldDelete} onCancel={() => setShouldDelete(undefined)} onDelete={() => setShouldDelete(undefined)} />
            }
        </>
    )
};

