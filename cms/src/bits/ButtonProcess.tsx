import React, { Children, createContext, useContext, useMemo } from 'react';
import { Button } from '@bdxtown/canaille';
import { IconLoader3, IconTimelineEvent, IconTimelineEventExclamation } from '@tabler/icons-react';
import { AppError } from '../data/AppError';

const ProcessContext = createContext({
    processing: false,
    disabled: false,
})

export const ButtonProcessButton = (props: React.ComponentProps<typeof Button>) => {
    const {
        processing,
        disabled
    } = useContext(ProcessContext)
return (
    <Button {...props} disabled={processing || disabled}  />
)
}


const ButtonProcess = ({ className = '', disabled, processing, error, success, children, ...rest}: { className?: string, disabled?: boolean, processing: boolean, success?: React.ReactNode, error?: AppError, children: React.ReactNode, [x: string]: unknown }) => {

    React.useEffect(() => {
        if(error && success) console.warn('Setting an error and a success message in the same time results in a confusing user experience.')
    }, [error, success])

    const value = useMemo(() => {
        return ({
            processing,
            disabled: disabled || false,
        })
    }, [processing, disabled])

    const ActualButton = 
        (Children.toArray(children) as React.ReactElement[]).find((c) => c.type === ButtonProcessButton)
        || <Button {...rest} disabled={processing || disabled}>{ children }</Button>

    return (
        <ProcessContext.Provider value={value}>
            <div className={`${className} flex flex-col gap-2`}>
                <div className={`flex gap-2 items-center justify-end`}>
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
                    { ActualButton }
                </div>
                {
                    !processing && error && <span className='text-red-500 min-w-full text-right'>{ error.userMessage }</span>
                }
                {
                    !processing && success && <span className='text-green-600 min-w-full text-right'>{ success }</span>
                }
            </div>
        </ProcessContext.Provider>
    );
}

ButtonProcess.Button = ButtonProcessButton;

export { ButtonProcess }