import React from 'react';
import { Button } from '@bdxtown/canaille';
import { IconLoader3, IconTimelineEventExclamation } from '@tabler/icons-react';
import { AppError } from '../data/AppError';


export const ButtonProcess = ({ className = '', disabled, processing, error, children, ...rest}: { className?: string, disabled?: boolean, processing: boolean, error?: AppError, children: React.ReactNode, [x: string]: unknown }) => {

    return (
        <div className={`${className} flex gap-2 items-center justify-end flex-wrap`}>
            {
                processing && <IconLoader3 className='animate-spin' />
            }
            {
                !processing && error && <IconTimelineEventExclamation className='text-red-500' />
            }
            <Button {...rest} disabled={processing || disabled}>{ children }</Button>
            {
                !processing && error && <span className='text-red-500'>{ error.userMessage }</span>
            }
        </div>
    );
}