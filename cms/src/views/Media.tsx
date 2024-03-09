import React from 'react';
import { Block, Button, useTranslations, Checkbox, createUseStyles } from "@bdxtown/canaille";
import { IconTrash, IconBook2, IconDownload } from '@tabler/icons-react';
import { Media as IMedia } from 'types/src/Media';
import { Modal } from '../bits/Modal';


import fr from './Media.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { ButtonUpload } from '../bits/ButtonUpload';
import { weight } from '../helpers/weight';
import { ButtonProcess } from '../bits/ButtonProcess';
import { AppError } from '../data/AppError';
import { DELETE_MEDIA_DENY, DELETE_MEDIA_FAIL } from '../services/media';
import { Loader } from '../bits/Loader';

const useStyle = createUseStyles({
    confirmDelete: {
        "&>button": {
            background: "rgb(239 68 68 / var(--tw-bg-opacity))",
        }
    }
})

const DeleteModal = ({ onCancel, media, onDelete }: { onCancel: React.MouseEventHandler, onDelete: React.MouseEventHandler, media: IMedia[] }) => {
    const { confirmDelete } = useStyle();
    const { actions } = useAppContext();
    const { deleteMedia } = actions;
    const { T } = useTranslations('Media', {'fr-FR': fr});

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState<AppError | undefined>(undefined);

    const onConfirm: React.MouseEventHandler = React.useCallback(async (e) => {
        setProcessing(true);
        try {
            await Promise.all(media.map((m) => deleteMedia(m)));
        } catch (e) {
            const appError = e as AppError;
            if(appError.code === DELETE_MEDIA_FAIL || appError.code === DELETE_MEDIA_DENY) {
                setError(error);
            } else {
                throw e;
            }

        } finally {
            setProcessing(false);
        }
        onDelete(e);
    }, [deleteMedia, error, media, onDelete]);

    return (
        <Modal className='bg-additional-primary' onClose={onDelete}>
            <T>shouldDelete</T>
            <div className='mt-3 flex justify-between items-center gap-4'>
                <ButtonProcess className={confirmDelete} size={50} processing={processing} error={error} onClick={onConfirm}>
                    <IconTrash /> <T>confirm</T>
                </ButtonProcess>
                <Button size={50} onClick={onCancel}>
                    <IconBook2 /> <T>cancel</T>
                </Button>
            </div>
        </Modal>
    );
}

const Media = () => {
    const { T } = useTranslations('Media', {'fr-FR': fr });
    const [shouldDelete, setShouldDelete] = React.useState<IMedia[] | undefined>(undefined);

    const { media, online } = useAppContext();


    const onDelete: React.MouseEventHandler<HTMLButtonElement> = React.useCallback((e) => {
        const form = e.currentTarget.form;
        const data = Array.from(new FormData(form as HTMLFormElement).keys());
        const cmedia = data.map((d) => media.find((m) => m.file === d)).filter((c) => !!c) as IMedia[];
        setShouldDelete(cmedia);
    }, [media]);

    if(!media) {
        return (
            <div className='grow flex items-center justify-center'>
                <Loader />
            </div>
        )
    }

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
                    <Button disabled={!online} className='hover:bg-red-500' size={50} variant="light" onClick={onDelete}><IconTrash /> <T>delete</T></Button>
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

export default Media;