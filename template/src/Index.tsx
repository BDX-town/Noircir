import React from 'react';

import { Line, Block, createUseStyles } from '@bdxtown/canaille';
import { Blog } from 'types/src/Blog';
import { Post } from 'types/src/Post';
import { Footer } from './Footer'
import sanitizeHTML from './sanitize';
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

const useStyle = createUseStyles({
    title: {
        lineHeight: 1.20,
    }
})


const Index: React.FC<Blog & Collection> = ({ blogName, fediverse, blogDescription, blogCover, pages, lang }) => {
    const { title } = useStyle();
    return (
        <div className='mx-auto max-w-[800px] min-h-screen p-4 flex flex-col gap-5'>
            <header className='flex gap-3 flex-col'>
                <div className='flex items-center gap-3'>
                    <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                    <h1>
                        { blogName }
                    </h1>
                </div>
                <Line />
                <p dangerouslySetInnerHTML={{ __html: sanitizeHTML(blogDescription) }} />
            </header>
            <main className='flex flex-col gap-4 grow'>
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url} className="no-underline">
                            <Block className='bg-additional-primary text-grey-100 overflow-hidden p-0'>
                                <article>
                                    {
                                        page.data.cover && <img className='w-full h-[100px] object-cover' src={page.data.cover} />
                                    }
                                    <div className='p-3'>
                                        <h2 className={`leading-5 m-0 mb-3 ${title}`}>
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
            <Footer fediverse={fediverse} />
        </div>
    );
}

export default withI18n(Index);