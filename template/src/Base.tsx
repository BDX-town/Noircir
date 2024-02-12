import React from 'react';

import { IArticle } from './types';

export const Base: React.FC<IArticle> = ({ title, blogName, lang, content }: IArticle) => {
    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title} - {blogName}</title>
            </head>
            <body>
                <header>{ blogName }</header>
                <main>
                    { content }
                </main>
            </body>
        </html>
    )
}