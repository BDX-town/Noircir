import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { Line } from '@bdxtown/canaille';

import { useTranslations, createUseStyles } from '@bdxtown/canaille';
import { withI18n } from './withI18n';

import sanitizeHTML from './sanitize'

import fr from './Article.fr-FR.i18n.json';

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

const Article: React.FC<Post & Blog> = ({ title, blogName, lang, content, blogCover, cover, description, updatedAt }) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });
    const { shadow, article } = useStyle();
    return (
        <div className='max-w-[800px] mx-auto'>
            <header className='p-3'>
                <a href="./.." className='no-underline text-grey-100'>
                    <div className='flex items-center gap-3'>
                            <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                            <h1>
                                { blogName }
                            </h1>
                    </div>
                </a>
            </header>
            <main>
                <article className='bg-additional-primary'>
                    {
                        cover && <img className={`w-full max-h-[300px] object-cover ${shadow} md:rounded-lg`} src={cover} />
                    }
                    <section>
                        <h1 className='mb-2 text-center'>{ title }</h1>
                        <div className='text-center'>
                            <T date={new Date(updatedAt).toLocaleDateString(lang)}>date</T>
                        </div>
                        <h4 className='p-4 mb-0 break-words'>
                            { description }
                        </h4>
                    </section>
                    {
                        // TODO: sanitize what's outputed (?) here
                    }
                    <section id="article_content" className={`p-4 break-words ${article}`}>
                        <Line />
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                    </section>
                </article>
            </main>
        </div>
    )
}

export default withI18n(Article);