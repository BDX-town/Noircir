import { IconLoader2 } from '@tabler/icons-react';

export const Loader = ({ className }: { className?: string }) => {
    return (
        <div className={className}>
            <IconLoader2 className='animate-spin' size={50} />
        </div>
    )
}