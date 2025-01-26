import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { createUseStyles } from '@bdxtown/canaille';
import { withI18n } from './withI18n';

import sanitizeHTML from './sanitize'

import { Footer } from './Footer';

const useStyle = createUseStyles({
    article: {
        "& img": {
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "100%",
            display: "block",
            borderRadius: "var(--rounded-25)"
        }
    }
})

const Article: React.FC<Post & Blog> = ({ title, blogName, fediverse, lang, content, cover, description, updatedAt }) => {
    const { article } = useStyle();

    return (
        <div className='flex flex-col min-h-screen min-[900px]:py-4'>
            <div className={`max-w-[900px] w-full grow mx-auto min-[900px]:rounded-[16px] bg-grey-100 p-4 flex flex-col`}>
                <header>
                    <section className='flex gap-6 items-end max-[900px]:flex-wrap'>
                        <a href='./..' className='no-underline'>
                            <h1 className='text-white relative top-[0.25em]'>{blogName}</h1>
                        </a>
                        <h2 className='text-white'>{title}</h2>
                    </section>
                    <section className='my-5'>
                        {cover && (
                            <div className='relative'>
                                <div className='h-[8px] w-full bg-grey-100 absolute top-[35px]'></div>
                                <div className='h-[16px] w-full bg-grey-100 absolute top-[10px]'></div>
                                <img className={`w-full max-h-[300px] object-cover rounded-lg`} src={cover} />
                                <div className='h-[4px] w-full bg-grey-100 absolute bottom-[55px]'></div>
                                <div className='h-[8px] w-full bg-grey-100 absolute bottom-[35px]'></div>
                                <div className='h-[16px] w-full bg-grey-100 absolute bottom-[10px]'></div>
                            </div>
                        )}
                    </section>
                    <section className='text-white mb-3'>
                        <h3>
                            {description}
                        </h3>
                    </section>
                </header>
                <div className='flex bg-white text-grey-100 grow'>
                    <main className='grow min-w-[0px]'>
                        <article className={`break-all ${article} p-3`}>
                            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                        </article>
                    </main>
                    <div className='w-[2rem] shrink-0 '>
                        <time className='block relative right-2 text-[2rem] rotate-90'>
                            {new Date(updatedAt).toLocaleDateString(lang)}
                        </time>
                        <div className='relative bg-brand-primary'>
                            <div className='h-full w-[8px] bg-grey-100 absolute right-[6px]'></div>
                        </div>
                    </div>
                </div>
                <Footer className='mt-3 text-sm text-white' fediverse={fediverse} />
            </div>
        </div>
    );
}

export default withI18n(Article);