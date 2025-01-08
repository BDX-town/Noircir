

import { useTranslations } from '@bdxtown/canaille'
import fr from './Footer.fr-FR.i18n.json'
import { useMemo } from 'react'

const tr = {
    "fr-FR": fr
}

export const Footer = ({ fediverse }: { fediverse?: string}) => {
    const { T } = useTranslations('Footer', tr)

    const fediverseUrl = useMemo(() => { 
        if(!fediverse) return null;
        const [user, host] = fediverse.slice(1).split('@');
        return `https://${host}/users/@${user}`;
    }, [fediverse])

    return (
        <footer className='flex flex-col items-center gap-2 text-center text-xs text-gray-700'>
            {
                fediverse && fediverseUrl && (
                    <div>
                        <a target='_blank' href={fediverseUrl}>{fediverse}</a>
                    </div>
                )
            }
            <T>about</T>
            <a className='block' target='_blank' href="https://github.com/BDX-town/Noircir">Github</a>
        </footer>
    )
}