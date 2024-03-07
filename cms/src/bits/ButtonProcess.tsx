import React from 'react';
import { Button } from '@bdxtown/canaille';
import { IconLoader3, IconTimelineEvent, IconTimelineEventExclamation } from '@tabler/icons-react';
import { AppError } from '../data/AppError';


export const ButtonProcess = ({ className = '', disabled, processing, error, success, children, ...rest}: { className?: string, disabled?: boolean, processing: boolean, success?: React.ReactNode, error?: AppError, children: React.ReactNode, [x: string]: unknown }) => {

    React.useEffect(() => {
        if(error && success) console.warn('Setting an error and a success message in the same time results in a confusing user experience.')
    }, [error, success])

    return (
        <div className={`${className} flex gap-2 items-center justify-end flex-wrap`}>
            {
                processing ? <IconLoader3 className='animate-spin' />
                : <>
                    {
                        error && <IconTimelineEventExclamation className='text-red-500' />
                    }
                    {
                        success && <IconTimelineEvent className='text-green-600' />
                    }
                </>
            }
            <Button {...rest} disabled={processing || disabled}>{ children }</Button>
            {
                !processing && error && <span className='text-red-500 min-w-full text-right'>{ error.userMessage }</span>
            }
            {
                !processing && success && <span className='text-green-600 min-w-full text-right'>{ success }</span>
            }
        </div>
    );
}