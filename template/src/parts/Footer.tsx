

import { useTranslations } from '@bdxtown/canaille'
import fr from './Footer.fr-FR.i18n.json'
import { useMemo } from 'react'

const tr = {
    "fr-FR": fr
}

export const Footer = ({ fediverse, className, ...props }: { fediverse?: string } & Partial<HTMLElement>) => {
    const { T } = useTranslations('Footer', tr)

    const fediverseUrl = useMemo(() => { 
        if(!fediverse) return null;
        const [user, host] = fediverse.slice(1).split('@');
        return `https://${host}/users/@${user}`;
    }, [fediverse])

    return (
        <footer >
            {
                fediverse && fediverseUrl && (
                        <a target='_blank' href={fediverseUrl}>{fediverse}</a>
                )
            }
            <T>about</T>
            <div>
                🖥️ <a target='_blank' href="https://github.com/BDX-town/Noircir">Github</a>
            </div>
        </footer>
    )
}