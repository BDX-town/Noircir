import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { useTranslations, createUseStyles } from '@bdxtown/canaille';
import { withI18n } from './withI18n';

import sanitizeHTML from './sanitize'

import fr from './Article.fr-FR.i18n.json';
import { Footer } from './Footer';

const useStyle = createUseStyles({
    shadow: {
        boxShadow: "var(--dp-100)"
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

const Article: React.FC<Post & Blog> = ({ title, blogName, fediverse, lang, content, blogCover, cover, description, updatedAt }) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });
    const { shadow, article } = useStyle();
    return (
        <div className='flex flex-col gap-7 py-4'>
            <header className='max-w-[800px] mx-auto flex flex-col gap-2'>
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center justify-between gap-2'>
                        <h1 className='text-base font-bold my-0'>
                            <a href="./.." className='no-underline text-grey-100'>

                                {blogName}
                            </a>

                        </h1>

                        <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                    </div>
                    <h2 className='my-0 text-base font-normal leading-7'>
                        {title}
                    </h2>
                </div>
                <div className='text-sm text-right'>
                    <T date={new Date(updatedAt).toLocaleDateString(lang)}>date</T>
                </div>
            </header>
            <div className='pb-11'>
                <hr className='my-0 border-b-0' />
            </div>
            <main className='max-w-[800px] mx-auto'>
                <article className='flex flex-col gap-4'>
                    {
                        cover && <img className={`w-full max-h-[300px] object-cover ${shadow} rounded-lg`} src={cover} />
                    }
                    <section className='flex flex-col gap-3 font-bold'>
                        {description}
                    </section>
                    <section id="article_content" className={`break-words ${article}`}>
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                    </section>
                </article>
            </main>
            <Footer fediverse={fediverse} />
        </div>
    )
}

export default withI18n(Article);