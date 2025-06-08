import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';
import { Wrapper } from './../types';

const HTML: React.FC<Blog & Post & Wrapper> = ({ title, fediverse, blogName, blogCover, lang, content, style, page, cover, description }) => {
    console.log({
        title,
        fediverse,
        blogName,
        blogCover,
        lang, 
        content,
        style,
        page,
        cover,
        description
    })
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/x-icon" href={blogCover} />
                <title>{ `${title} - ${blogName}`}</title>
                <link rel="stylesheet" href={style} />
                <meta property="og:title" content={title}/>
                <meta property="og:type" content="article"/>
                <meta property="og:url" content={page.url}/>
                { cover && <meta property="og:image" content={cover}/>}
                <meta property="og:description" content={description}/>
                <meta name="fediverse:creator" content={fediverse} />
            </head>
            <body dangerouslySetInnerHTML={{ __html: content }}>
            </body>
        </html>
    )
}

export default HTML;