import React from 'react';

import { Blog } from 'types/src/Blog';
import { Post } from 'types/src/Post';
import { Footer } from './Footer'
import { withI18n } from '../withI18n';

interface Collection {
    /**
     * Eleventy generated collection data
     */
    pages: Array<{
        data: Post,
        page: {
            url: string,
        }
    }>
}

const Index: React.FC<Blog & Collection> = ({ blogName, fediverse, blogDescription, blogCover, pages, lang }) => {
    return (
        <>
            <header>
                <div>
                    <h1>
                        <a href="./.." >
                            {blogName}
                        </a>
                    </h1>
                    <img  src={blogCover} />
                </div>
                <h2>
                    Lorem Ipsum dolor sin amet
                    {blogDescription}
                </h2>
            </header>
            <main >
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url}>
                            <article>
                                {
                                    page.data.cover && <img src={page.data.cover} />
                                }
                                <h3>
                                    {page.data.title}
                                </h3>
                                <time dateTime={new Date(page.data.createdAt).toISOString()}>
                                    {new Date(page.data.createdAt).toLocaleDateString(lang, { dateStyle: 'full' })}
                                </time>
                            </article>
                        </a>
                    ))
                }
            </main>
            <Footer fediverse={fediverse} />
        </>
    );
}

export default withI18n(Index);