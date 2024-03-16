import React from 'react';

import fr from './Sync.fr-FR.i18n.json';
import { useTranslations, Button } from '@bdxtown/canaille';
import { subscribe, unsubscribe } from '../sw/sw';
import { SW_MESSAGES } from '../sw/messages';
import { IconCheck, IconLoader3, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useAppContext } from '../data/AppContext';
import { flushSync } from 'react-dom';
import { AppError } from '../data/AppError';
import { useFloating } from '@floating-ui/react';

function handleQueueError(result: unknown): AppError {
    return result as AppError;
}

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

const ErrorItem = ({ error} : { error: AppError}) => {
    const { T } = useTranslations("Sync", { 'fr-FR': fr });
    return (
        <>
            <div className='text-sm'>
                <T>error</T> { error.userCode && `#${error.userCode}` }
            </div>
            <div className='text-xs'>
                { error.userMessage || error.message }
            </div>
        </>
    )
}

const ErrorDropdown = ({ reference, errors }: { reference: HTMLElement, errors: unknown[]}) => {
    const { T } = useTranslations("Sync", { 'fr-FR': fr });
    const {refs, floatingStyles} = useFloating({elements: { reference }});
    return (
        <div ref={refs.setFloating} className='bg-additional-primary border-solid border-2 rounded px-2 py-1 mt-2' style={floatingStyles}>
            {
                errors.length === 0 && <div className='flex items-center gap-2'><IconCheck size={16} className='text-green-600' /> <span className='text-xs text-gray-600'><T>no-errors</T></span></div>
            }
            {
                errors.map((e) => <ErrorItem error={e as AppError} />)
            }
        </div>
    )
}

export const Sync = () => {
    const { T } = useTranslations("Sync", { 'fr-FR': fr });
    const root = React.useRef<HTMLButtonElement>(null);
    const { online, actions } = useAppContext();
    const { refresh } = actions;
    const [syncing, setSyncing] = React.useState(false);
    const desync = React.useRef(false);

    const [queue, setQueue] = React.useState(0);
    const [errors, setErrors] = React.useState<unknown[]>([]);

    const [dropdown, setDropdown] = React.useState(false);

    const onWindowClick = React.useCallback((e: MouseEvent) => {
        if(root.current?.contains(e.target as Node)) return;
        setDropdown(false);
    }, []);

    React.useEffect(() => {
        window.addEventListener('click', onWindowClick);
        return () => {
            window.removeEventListener('click', onWindowClick);
        }
    }, [onWindowClick]);

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
            flushSync(() => setErrors([...errors, handleQueueError(data)]));
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
        // we refetch data from the server when all the queue was processed
        if(online && !syncing && desync.current && errors.length === 0 && queue === 0) {
            sync();
        }
    }, [errors.length, online, queue, sync, syncing]);

    const onClick: React.MouseEventHandler = React.useCallback((e) => {
        e.stopPropagation();
        setDropdown(!dropdown);
    }, [dropdown]);

    return (
        <>
            <Button variant='secondary' ref={root} className="p-1" onClick={onClick}>
                <div className='text-xs opacity-60 '>
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
                </div>
            </Button>
            {
                !online && (
                    <div className='text-xs opacity-60'>
                        <T>offline</T>
                    </div>
                )
            }
            {
                dropdown && <ErrorDropdown reference={root.current as HTMLElement} errors={errors} />
            }
        </>
    )
};