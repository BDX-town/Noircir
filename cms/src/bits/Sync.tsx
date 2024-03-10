import React from 'react';

import fr from './Sync.fr-FR.i18n.json';
import { useTranslations } from '@bdxtown/canaille';
import { subscribe, unsubscribe } from '../sw/sw';
import { SW_MESSAGES } from '../sw/messages';
import { IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useAppContext } from '../data/AppContext';

export const Sync = () => {
    const { T } = useTranslations("Sync", { 'fr-FR': fr });
    const { online } = useAppContext();

    const [queue, setQueue] = React.useState(0);

    const onMessage = React.useCallback(({ type, data}: { type: SW_MESSAGES, data: unknown}) => {
        if(type === SW_MESSAGES.QUEUE_UPDATE) {
            const queue = data as string[];
            setQueue(queue.length);
        } else if(type === SW_MESSAGES.QUEUED_REQUEST_ERROR) {
            console.log('queue error', data);
        }
    }, []);

    React.useEffect(() => {
        subscribe(onMessage);

        return () => unsubscribe(onMessage);
    }, [onMessage]);

    return (
        <div className="flex items-center gap-2">
            {
                online ? (
                    <>
                        <IconWifi className='opacity-20' />
                    </>
                ) : (
                    <>
                        <IconWifiOff /> <span className='text-sm'><T number={queue}>queued-operation</T></span>
                    </>
                )
            }
        </div>
    )
};