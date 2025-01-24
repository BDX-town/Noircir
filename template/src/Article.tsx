import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { createUseStyles } from '@bdxtown/canaille';
import { withI18n } from './withI18n';

import sanitizeHTML from './sanitize'

import { Footer } from './Footer';

const useStyle = createUseStyles({
    page: {
        maxWidth: '900px',
        margin: "auto",
        borderRadius: "var(--rounded-100)",
    },
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
    const { page, article } = useStyle();

    return (
        <div className={`${page} bg-grey-100 p-4`}>
            <header>
                <section className='flex gap-6 items-end'>
                    <h1 className='text-white relative bottom-[-1.2rem]'>{ blogName }</h1>
                    <h2 className='text-white'>{ title }</h2>
                </section>
                { cover && <img className={`my-5 w-full max-h-[300px] object-cover rounded-lg`} src={cover} />}
                <section className='text-white '>
                    <h3>
                        { description }
                    </h3>
                    <time className='block text-sm text-right my-2'>
                        { new Date(updatedAt).toLocaleDateString(lang) }
                    </time>

                </section>
            </header>
            <main className='my-3 bg-white text-grey-100 p-3 rounded-md'>
                <article className={`break-words ${article}`}>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                </article>
            </main>
            <Footer className='mt-3 text-sm' fediverse={fediverse} />
        </div>
    );
}

export default withI18n(Article);