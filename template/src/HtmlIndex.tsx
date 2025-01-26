import React from 'react';

import { Wrapper } from './types';
import { createUseStyles, StyleMeta } from '@bdxtown/canaille';

// @ts-expect-error no type
import CleanCSS from 'clean-css';
import { Blog } from 'types/src/Blog';
import sanitize from './sanitize';

const clean = new CleanCSS({ level: 2 });

const useStyle = createUseStyles({
    body: {
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: 0,
        }
    }
})

const HTML: React.FC<Wrapper & Blog> = ({ fediverse, blogName, blogCover, lang, content, style, page, blogDescription }) => {
    const { body } = useStyle();
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/x-icon" href={blogCover} />
                <title>{ blogName}</title>
                <link rel="stylesheet" href={style} />
                <style dangerouslySetInnerHTML={{__html: clean.minify([...StyleMeta.layerSheet.style, ...StyleMeta.staticSheet.style, ...StyleMeta.dynamicSheet.style].join('\n')).styles }} />
                <meta property="og:title" content={blogName}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={page.url}/>
                <meta property="og:image" content={blogCover}/>
                <meta property="og:description" content={blogDescription}/>
                <meta name="fediverse:creator" content={fediverse} />
            </head>
            <body className={`${body} bg-white`} dangerouslySetInnerHTML={{ __html: sanitize(content) }}>
            </body>
        </html>
    )
}

export default HTML;