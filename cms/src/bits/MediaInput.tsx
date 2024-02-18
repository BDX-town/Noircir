import React from 'react';
import { TextInput, Button, useTranslations } from '@bdxtown/canaille';

import { MediaSelectionModal } from './MediaSelectionModal';
import { Media } from '../types/Media';
import { IconPhoto } from '@tabler/icons-react';

import fr from './MediaInput.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';


export const MediaInput = ({ label, onPick, defaultValue, value, className, ...rest }: { className?: string, label?: React.ReactNode, onPick?: (m: Media, alt: string) => void, defaultValue?: string, value?: string, [x: string]: unknown } ) => {
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
        <div className='flex gap-2'>
            <TextInput {...rest} className={`grow ${className}`} label={label} value={currentMedia?.url}>
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (currentMedia && <img className='order-first rounded-lg w-[40px] h-[40px] object-cover mr-1' src={currentMedia.url} />) as any
                }
            </TextInput>
            <Button className='text-nowrap break-keep whitespace-nowrap block' size={50} variant='light' onClick={() => setModal(true)}>
                    <IconPhoto size={20} />
                    <div>
                        <T>choose</T>
                    </div>
            </Button>
            {
                modal && <MediaSelectionModal onPick={onInternalPick} onCancel={() => setModal(false)}/>
            }
        </div>
    )
}