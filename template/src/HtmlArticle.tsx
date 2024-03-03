import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';
import { Wrapper } from './types';
import { StyleMeta } from '@bdxtown/canaille';


// @ts-expect-error no type
import CleanCSS from 'clean-css';

const clean = new CleanCSS({ level: 2 });


const HTML: React.FC<Blog & Post & Wrapper> = ({ title, blogName, blogCover, lang, content, style, page, cover, description }) => {
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/x-icon" href={blogCover} />
                <title>{ `${title} - ${blogName}`}</title>
                <link rel="stylesheet" href={style} />
                <style dangerouslySetInnerHTML={{__html: clean.minify([...StyleMeta.layerSheet.style, ...StyleMeta.staticSheet.style, ...StyleMeta.dynamicSheet.style].join('\n')).styles }} />
                <meta property="og:title" content={title}/>
                <meta property="og:type" content="article"/>
                <meta property="og:url" content={page.url}/>
                { cover && <meta property="og:image" content={cover}/>}
                <meta property="og:description" content={description}/>
            </head>
            {
                // TODO: sanitize what's outputed (?) here
            }
            <body className='bg-additional-primary' dangerouslySetInnerHTML={{ __html: (content) }}>
            </body>
        </html>
    )
}

export default HTML;