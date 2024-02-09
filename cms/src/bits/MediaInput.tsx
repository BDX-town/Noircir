import React from 'react';
import { TextInput, Button, useTranslations } from '@bdxtown/canaille';

import { MediaSelectionModal } from './MediaSelectionModal';
import { Media } from '../types/Media';
import { IconPhoto } from '@tabler/icons-react';

import fr from './MediaInput.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';


export const MediaInput = ({ label, onPick, defaultValue, value, ...rest }: { label?: React.ReactNode, onPick?: (m: Media, alt: string) => void, defaultValue?: string, value?: string, [x: string]: unknown } ) => {
    const { T } = useTranslations('MediaInput', {'fr-FR': fr});
    const [modal, setModal] = React.useState(false);
    const { media } = useAppContext();
    const [currentMedia, setCurrentMedia] = React.useState<Media | undefined>(media.find((m) => m.url === value || m.url === defaultValue));

    React.useEffect(() => {
        if(!defaultValue) {
            setCurrentMedia(media.find((m) => m.url === value))
        }
    }, [value, defaultValue, media]);

    const onInternalPick = React.useCallback((media: Media, alt: string) => {
        setCurrentMedia(media);
        setModal(false);
        if(onPick) onPick(media, alt);
    }, [onPick]);

    return (
        <>
            <TextInput {...rest} label={label} readonly value={currentMedia?.url || ''}>
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (currentMedia && <img className='order-first rounded-lg w-[40px] h-[40px] object-cover mr-1' src={currentMedia.url} />) as any
                }
                <Button className='text-nowrap break-keep whitespace-nowrap' size={50} variant='light' onClick={() => setModal(true)}>
                    <T>choose</T>
                    <IconPhoto size={20} />
                </Button>
            </TextInput>
            {
                modal && <MediaSelectionModal onPick={onInternalPick} onCancel={() => setModal(false)}/>
            }
        </>
    )
}