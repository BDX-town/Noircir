import React from 'react';

import { useTranslations } from '@bdxtown/canaille';
import { useAppContext } from '../data/AppContext';
import { IconUpload } from '@tabler/icons-react';
import { Media } from 'types/src/Media';
import { arrayBufferToWebP } from 'webp-converter-browser'
import { AppError } from '../data/AppError';
import { ButtonProcess } from './ButtonProcess';

import fr from './ButtonUpload.fr-FR.i18n.json';
import { PUT_MEDIA_DENY, PUT_MEDIA_FAIL, PUT_MEDIA_FALSE, PUT_MEDIA_QUEUED } from '../services/media';

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
    const { __ } = useTranslations('ButtonUpload', { 'fr-FR': fr });
    const input = React.useRef<HTMLInputElement>(null);


    const upload = useUpload();

    const [error, setError] = React.useState<AppError | undefined>(undefined);
    const [success, setSuccess] = React.useState<string | undefined>(undefined);
    const [processing, setProcessing] = React.useState(false);

    const onChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(async (e) => {
        const file = (e.currentTarget.files as FileList)[0];
        setProcessing(true);
        setSuccess(undefined);
        setError(undefined);
        try {
            await upload(file);
            setSuccess(__('success'));
            if(onUpload) onUpload(file);
        } catch (e) {
            const appError = e as AppError;
            if(appError.code === PUT_MEDIA_FAIL || appError.code === PUT_MEDIA_DENY || appError.code === PUT_MEDIA_FALSE) setError(appError);
            else if(appError.code === PUT_MEDIA_QUEUED) setSuccess(appError.userMessage);
            else throw e;
        } finally {
            setProcessing(false);
        }
    }, [__, onUpload, upload]);

    return (
        <>
            <input ref={input} className="hidden" accept='image/*' type="file" onChange={onChange} />
            <ButtonProcess {...rest} processing={processing} error={error} success={success} size={50} onClick={() => input.current?.click()}>
                <IconUpload /> { children }
            </ButtonProcess>
        </>
    );
}