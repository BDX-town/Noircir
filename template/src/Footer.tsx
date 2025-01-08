

import { useTranslations } from '@bdxtown/canaille'
import fr from './Footer.fr-FR.i18n.json'

const tr = {
    "fr-FR": fr
}

export const Footer = () => {
    const { T } = useTranslations('Footer', tr)

    return (
        <footer className='text-center text-xs text-gray-700'>
            <T>about</T>
            <a className='block' target='_blank' href="https://github.com/BDX-town/Noircir">Github</a>
        </footer>
    )
}