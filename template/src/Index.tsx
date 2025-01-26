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
        <div className='max-w-[900px] mx-auto min-h-screen flex flex-col text-grey-100 bg-white'>
            <header className='inline-flex gap-6 items-end px-3'>
                <h1 className='relative top-[0.25em]'>
                    {blogName}
                </h1>
                <h2>
                    {blogDescription}
                </h2>
            </header>
            <div className='h-[8px] w-full bg-grey-100 mt-2'></div>
            <div className='h-[16px] w-full bg-grey-100 my-2'></div>
            <main className='bg-grey-100 grow flex gap-4 flex-wrap justify-center p-4'>
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url} className=" w-[350px] flex flex-col bg-white no-underline p-3">
                            {
                                page.data.cover ? (
                                    <img className='w-full grow object-cover' src={page.data.cover} />
                                ) : (
                                    <div className='w-full grow object-cover relative'>
                                        <div className='h-[8px] w-full bg-grey-100 absolute top-[35px]'></div>
                                        <div className='h-[16px] w-full bg-grey-100 absolute top-[10px]'></div>
                                        <div className='h-[4px] w-full bg-grey-100 absolute bottom-[55px]'></div>
                                        <div className='h-[8px] w-full bg-grey-100 absolute bottom-[35px]'></div>
                                        <div className='h-[16px] w-full bg-grey-100 absolute bottom-[10px]'></div>
                                    </div>
                                )
                            }
                            <div className='font-[CooperHewitt-Bold] text-2xl text-right mt-2'>
                                {new Date(page.data.createdAt).toLocaleDateString(lang)}
                            </div>
                            <div className='mt-3 font-bold text-sm'>
                                {page.data.title}
                            </div>
                        </a>
                    ))
                }
            </main>
            <div className='h-[16px] w-full bg-grey-100 mt-2'></div>
            <div className='h-[8px] w-full bg-grey-100 mt-2'></div>
            <div className='h-[4px] w-full bg-grey-100 mt-2'></div>
            <Footer className='text-grey-100 bg-white py-3 text-sm' fediverse={fediverse} />
        </div>
    );
}

export default withI18n(Index);