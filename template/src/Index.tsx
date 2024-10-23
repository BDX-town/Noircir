import React from 'react';

import { Line, Block } from '@bdxtown/canaille';
import { Blog } from 'types/src/Blog';
import { Post } from 'types/src/Post';
import { Footer } from './Footer'
import sanitizeHTML from './sanitize';



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


const Index: React.FC<Blog & Collection> = ({ blogName, blogDescription, blogCover, pages, lang }) => {
    return (
        <div className='mx-auto max-w-[800px]'>
            <header className='p-3'>
                <div className='flex items-center gap-3'>
                    <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                    <h1>
                        { blogName }
                    </h1>
                </div>
                <Line />
                <p className='px-3' dangerouslySetInnerHTML={{ __html: sanitizeHTML(blogDescription) }} />
            </header>
            <main className='p-3 flex flex-col gap-4'>
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url} className="no-underline">
                            <Block className='bg-additional-primary text-grey-100 overflow-hidden p-0'>
                                <article>
                                    {
                                        page.data.cover && <img className='w-full h-[100px] object-cover' src={page.data.cover} />
                                    }
                                    <div className='p-3'>
                                        <h2 className='m-0 mb-3'>
                                            { page.data.title }
                                        </h2>
                                        <p className='m-0'>
                                            { page.data.description }
                                        </p>
                                        <div className='text-right'>
                                            <time dateTime={new Date(page.data.createdAt).toISOString()}>{new Date(page.data.createdAt).toLocaleDateString(lang)}</time>
                                        </div>
                                    </div>
                                </article>
                            </Block>
                        </a>
                    ))  
                }
            </main>
            <Footer />
        </div>
    );
}

export default (Index);