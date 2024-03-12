import React from 'react';

import fr from './Sync.fr-FR.i18n.json';
import { useTranslations } from '@bdxtown/canaille';
import { subscribe, unsubscribe } from '../sw/sw';
import { SW_MESSAGES } from '../sw/messages';
import { IconLoader3, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useAppContext } from '../data/AppContext';
import { flushSync } from 'react-dom';

const Waiting = ({ queue, online }: { queue: number, online: boolean }) => {
    const { T } = useTranslations("Sync", { 'fr-FR': fr });
    return (
        (!online || queue > 0) ? (
            <T number={queue}>queued-operation</T>
        ) : (
            <T>in-sync</T>
        )
    )
}

export const Sync = () => {
    const { T } = useTranslations("Sync", { 'fr-FR': fr });
    const { online, actions } = useAppContext();
    const { refresh } = actions;
    const [syncing, setSyncing] = React.useState(false);
    const desync = React.useRef(false);

    const [queue, setQueue] = React.useState(0);
    const [errors, setErrors] = React.useState<unknown[]>([]);

    React.useEffect(() => {
        if(queue > 0) desync.current = true;
    }, [queue])

    const onMessage = React.useCallback(({ type, data}: { type: SW_MESSAGES, data: unknown}) => {
        if(type === SW_MESSAGES.QUEUE_UPDATE) {
            const queue = data as string[];
            setQueue(queue.length);
        } else if(type === SW_MESSAGES.QUEUED_REQUEST_ERROR) {
            console.log('queue error', data);
            // we ensure errors are immediatly processed
            flushSync(() => setErrors([...errors, data]));
        }
    }, [errors]);

    React.useEffect(() => {
        subscribe(onMessage);

        return () => unsubscribe(onMessage);
    }, [onMessage]);

    const sync = React.useCallback(async () => {
        setSyncing(true);
        try {
            await refresh();
        } finally {
            desync.current = false;
            setSyncing(false);
        }
    }, [refresh]);

    React.useEffect(() => {
        if(online && !syncing && desync.current && errors.length === 0 && queue === 0) {
            sync();
        }
    }, [errors.length, online, queue, sync, syncing]);

    return (
        <div className="text-xs opacity-60">
            <div className='flex items-center gap-1'>
                {
                    online ? (
                        (syncing || queue > 0) ? (
                            <IconLoader3 className='animate-spin' />
                        ) : (
                            <IconWifi className='text-green-500' />
                        )
                    ) : (
                        <IconWifiOff className='text-red-500' /> 
                    )
                }
                <Waiting queue={queue} online={online}/>
            </div>
            {
                !online && (
                    <div>
                        <T>offline</T>
                    </div>
                )
            }
 
        </div>
    )
};