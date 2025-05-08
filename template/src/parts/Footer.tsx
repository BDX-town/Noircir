

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
        <footer >
            {
                fediverse && fediverseUrl && (
                        <a target='_blank' href={fediverseUrl}>{fediverse}</a>
                )
            }
            <T>about</T>
            <a  href="https://github.com/BDX-town/Noircir">Github</a>
        </footer>
    )
}