import React from 'react';

import { IArticle } from './types';
import { StyleMeta } from '@bdxtown/canaille';

const HTML: React.FC<IArticle> = ({ title, blogName, lang, content, style }: IArticle) => {
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title} - {blogName}</title>
                <link rel="stylesheet" href={style} />
                <style dangerouslySetInnerHTML={{__html: StyleMeta.layerSheet.style.join('\n') }} />
                <style dangerouslySetInnerHTML={{__html: StyleMeta.staticSheet.style.join('\n') }} />
                <style dangerouslySetInnerHTML={{__html: StyleMeta.dynamicSheet.style.join('\n') }} />
            </head>
            {
                // TODO: sanitize what's outputed (?) here
            }
            <body className='bg-additional-primary' dangerouslySetInnerHTML={{ __html: content }}>
            </body>
        </html>
    )
}

export default HTML;