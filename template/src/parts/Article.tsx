import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { useTranslations } from '@bdxtown/canaille';
import { withI18n } from './../withI18n';

import sanitizeHTML from './../sanitize'

import fr from './Article.fr-FR.i18n.json';
import { Footer } from './Footer';

const Article: React.FC<Post & Blog> = ({ title, blogName, fediverse, lang, content, blogCover, cover, description, updatedAt }) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });
    return (
        <>
            <header >
                <div >
                    <h1 >
                        <a href="./.." >
                            {blogName}
                        </a>
                    </h1>

                    <img src={blogCover} />
                </div>
                <h2 >
                    {title}
                </h2>
                <time>
                    <T date={new Date(updatedAt).toLocaleDateString(lang)}>date</T>
                </time>
            </header>
            <main >
                <article >
                    {
                        cover && <img src={cover} />
                    }
                    <section >
                        {description}
                    </section>
                    <section id="article_content">
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                    </section>
                </article>
            </main>
            <Footer fediverse={fediverse} />
        </>
    )
}

export default withI18n(Article);