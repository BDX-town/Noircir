import { IconLoader3 } from '@tabler/icons-react';

export const Loader = ({ className }: { className?: string }) => {
    return (
        <div className={className}>
            <IconLoader3 className='animate-spin' size={50} />
        </div>
    )
}