import React, { useRef } from 'react';
import { Button } from '@bdxtown/canaille';

import { MediaSelectionModal } from './MediaSelectionModal';
import { Media } from 'types/src/Media';
import { IconColorPicker, IconPhotoOff } from '@tabler/icons-react';

import { useAppContext } from '../data/AppContext';
import { weight } from '../helpers/weight';


export const MediaInput = ({ onPick, name, defaultValue, value, className, children,...rest }: { name?: string, children: React.ReactNode, className?: string, label?: React.ReactNode, onPick?: (m: Media, alt: string) => void, defaultValue?: string, value?: string, [x: string]: unknown } ) => {
    const input = useRef<HTMLInputElement>(null);
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

    if(!media) return null;

    return (
        <div className='flex flex-col gap-1 rounded-md w-min '>
            <input {...rest} ref={input} name={name} type="hidden" value={currentMedia?.url} />
            <input name={`${name || new Date().getTime()}-weight`} type="hidden" value={currentMedia?.weight} />
            <div className={`flex flex-col rounded-lg border-2 border-solid border-grey-100 bg-additional-primary-light p-2 ${className}`}>
                {
                    currentMedia && <img className='rounded-lg w-full max-h-full object-contain basis-0 min-h-0 grow' src={currentMedia?.url} />
                }
                {
                    !currentMedia && <div className='w-full basis-0 min-h-0 grow flex items-center justify-center text-gray-500'><IconPhotoOff /></div>
                }
            </div>
            
            <div className='flex justify-between gap-3 items-center'>
                <span className='text-nowrap whitespace-nowrap'>{currentMedia ? weight(currentMedia.weight) : "--Ko"}</span>
                <Button variant='light' size={50} className='text-nowrap whitespace-nowrap' onClick={() => setModal(true)}>{ children } <IconColorPicker size={16} /></Button>
            </div>
            {
                modal && <MediaSelectionModal onPick={onInternalPick} onCancel={() => setModal(false)}/>
            }
        </div>
    );
}