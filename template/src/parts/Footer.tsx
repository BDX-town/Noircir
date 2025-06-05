

import { useTranslations } from '@bdxtown/canaille'
import fr from './Footer.fr-FR.i18n.json'

const tr = {
    "fr-FR": fr
}

export const Footer = () => {
    const { T } = useTranslations('Footer', tr)

    return (
        <footer >
            <T>about</T>
            <div>
                🖥️ <a target='_blank' href="https://github.com/BDX-town/Noircir">Github</a>
            </div>
        </footer>
    )
}