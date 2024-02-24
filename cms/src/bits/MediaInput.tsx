import React from 'react';
import { Button } from '@bdxtown/canaille';

import { MediaSelectionModal } from './MediaSelectionModal';
import { Media } from 'types/src/Media';
import { IconColorPicker, IconPhotoOff } from '@tabler/icons-react';

import { useAppContext } from '../data/AppContext';
import { weight } from '../helpers/weight';


export const MediaInput = ({ onPick, defaultValue, value, className, children,...rest }: { children: React.ReactNode, className?: string, label?: React.ReactNode, onPick?: (m: Media, alt: string) => void, defaultValue?: string, value?: string, [x: string]: unknown } ) => {
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
            <div className={`flex flex-col gap-1 rounded-md w-min border-2 border-solid border-grey-100 bg-additional-primary-light p-2 ${className}`}>
                <input {...rest} type="hidden" value={currentMedia?.url} />
                {
                    currentMedia && <img className='rounded-lg w-full object-cover basis-0 min-h-0 grow' src={currentMedia?.url} />
                }
                {
                    !currentMedia && <div className='w-full basis-0 min-h-0 grow flex items-center justify-center text-gray-500'><IconPhotoOff /></div>
                }
            
                <div className='flex justify-between gap-3 items-center'>
                    <span className='text-nowrap whitespace-nowrap'>{currentMedia ? weight(currentMedia.weight) : "--Ko"}</span>
                    <Button variant='light' size={50} className='text-nowrap whitespace-nowrap' onClick={() => setModal(true)}>{ children } <IconColorPicker size={16} /></Button>
                </div>
            </div>
            {
                    modal && <MediaSelectionModal onPick={onInternalPick} onCancel={() => setModal(false)}/>
            }
        </>
    );
}