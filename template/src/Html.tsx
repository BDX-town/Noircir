import React from 'react';

import { IArticle } from './types';
import { StyleMeta } from '@bdxtown/canaille';

// @ts-expect-error no type
import CleanCSS from 'clean-css';


const clean = new CleanCSS({ level: 2 });

const HTML: React.FC<IArticle> = ({ title, blogName, lang, content, style }: IArticle) => {
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title} - {blogName}</title>
                <link rel="stylesheet" href={style} />
                <style dangerouslySetInnerHTML={{__html: clean.minify(StyleMeta.layerSheet.style.join('\n')).styles }} />
                <style dangerouslySetInnerHTML={{__html: clean.minify(StyleMeta.staticSheet.style.join('\n')).styles }} />
                <style dangerouslySetInnerHTML={{__html: clean.minify(StyleMeta.dynamicSheet.style.join('\n')).styles }} />
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