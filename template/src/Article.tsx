import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { Line } from '@bdxtown/canaille';

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
        <div className='max-w-[800px] mx-auto p-4 flex flex-col gap-5 min-h-screen'>
            <header className='leading-7'>
                <a href="./.." className='no-underline text-grey-100'>
                    <div className='flex items-center gap-3'>
                            <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                            <h1>
                                { blogName }
                            </h1>
                    </div>
                </a>
            </header>
            <main className='grow'>
                <article className='bg-additional-primary flex flex-col gap-4'>
                    {
                        cover && <img className={`w-full max-h-[300px] object-cover ${shadow} rounded-lg`} src={cover} />
                    }
                    <section className='flex flex-col gap-3'>
                        <h1 className='text-center'>{ title }</h1>
                        <div className='text-center text-sm'>
                            <T date={new Date(updatedAt).toLocaleDateString(lang)}>date</T>
                        </div>
                        <h4 className='break-words my-4'>
                            { description }
                        </h4>
                    </section>
                    <section id="article_content" className={`break-words ${article}`}>
                        <Line />
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                    </section>
                </article>
            </main>
            <Footer fediverse={fediverse} />
        </div>
    )
}

export default withI18n(Article);