import { FloatingOverlay } from '@floating-ui/react';
import { Block } from '@bdxtown/canaille';
import React from 'react';

export const Modal = ({ children, className, ...props }: { className?: string, children: React.ReactNode, [key:string]: unknown }) => {

    return (
        <FloatingOverlay lockScroll className='text-center z-10 bg-neutral-900/60'>
            <Block {...props} className={`inline-block relative top-[50%] translate-y-[-50%] ${className}`}>
                { children }
            </Block>
        </FloatingOverlay>
    )
};