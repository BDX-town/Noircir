import { FloatingOverlay } from '@floating-ui/react';
import { Block } from '@bdxtown/canaille';
import React from 'react';
import ReactDOM from 'react-dom';

export const Modal = ({ children, className, onClose, ...props }: { className?: string, children: React.ReactNode, onClose: ((e: KeyboardEvent) => void) | React.MouseEventHandler, [key:string]: unknown }) => {
    const onKeyUp = React.useCallback((e: KeyboardEvent) => {
        if(e.key === "Escape") {
            onClose(e as never);
        }
    }, [onClose]);

    React.useEffect(() => {
        window.addEventListener('keyup', onKeyUp);
        return () => window.removeEventListener('keyup', onKeyUp);
    });

    return ReactDOM.createPortal(
        <FloatingOverlay lockScroll className='text-center z-10 bg-neutral-900/60'>
            <Block {...props} className={`inline-block relative top-[50%] translate-y-[-50%] hover:shadow-none bg-additional-primary ${className}`}>
                { children }
            </Block>
        </FloatingOverlay>, document.body);
};