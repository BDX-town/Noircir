import React from 'react';

import { Blog } from 'types/src/Blog';
import { Post } from 'types/src/Post';
import { Footer } from './Footer'
import { withI18n } from './withI18n';

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
        <div className='flex flex-col gap-7 py-4'>
            <header className='w-full max-w-[800px] mx-auto flex flex-col gap-1'>
                <div className='flex items-center justify-between gap-2'>
                    <h1 className='text-base font-bold my-0'>
                        <a href="./.." className='no-underline text-grey-100'>

                            {blogName}
                        </a>

                    </h1>

                    <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                </div>
                <h2 className='my-0 text-base font-normal leading-7'>
                    Lorem Ipsum dolor sin amet
                    {blogDescription}
                </h2>
            </header>
            <div className='pb-11'>
                <hr className='my-0 border-b-0' />
            </div>
            <main className='flex flex-col gap-20 grow'>
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url} className="no-underline">
                            <div className='text-grey-100 overflow-hidden p-0'>
                                <article>
                                    {
                                        page.data.cover && <img className='w-full h-[100px] object-cover rounded-t' src={page.data.cover} />
                                    }
                                    <div className='font-bold'>
                                        {page.data.title}
                                    </div>
                                    <div className='text-sm mt-2'>
                                        <time dateTime={new Date(page.data.createdAt).toISOString()}>
                                            {new Date(page.data.createdAt).toLocaleDateString(lang, { dateStyle: 'full' })}
                                        </time>

                                    </div>

                                </article>
                            </div>
                        </a>
                    ))
                }
            </main>
            <Footer fediverse={fediverse} />
        </div>
    );
}

export default withI18n(Index);