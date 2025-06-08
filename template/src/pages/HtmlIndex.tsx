import React from 'react';

import { Wrapper } from './../types';
import { Blog } from 'types/src/Blog';

const HTML: React.FC<Wrapper & Blog> = ({ fediverse, blogName, blogCover, lang, content, style, page, blogDescription }) => {
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/x-icon" href={blogCover} />
                <title>{ blogName}</title>
                <link rel="stylesheet" href={style} />
                <meta property="og:title" content={blogName}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={page.url}/>
                <meta property="og:image" content={blogCover}/>
                <meta property="og:description" content={blogDescription}/>
                <meta name="fediverse:creator" content={fediverse} />
            </head>
            <body dangerouslySetInnerHTML={{ __html: content }}>
            </body>
        </html>
    )
}

export default HTML;