import React from 'react';

import { Blog } from 'types/src/Blog';
import { Post } from 'types/src/Post';
import { Footer } from './Footer'
import { withI18n } from '../withI18n';

import { Header } from './Header';
import { useTranslations } from '@bdxtown/canaille';

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

import fr from './Index.fr-FR.i18n.json'

const Index: React.FC<Blog & Collection> = ({ pages, lang, fediverse, ...rest }) => {
    const { T } = useTranslations("Index", { "fr-FR": fr })
    return (
        <main id='index'>
            <Header {...rest} fediverse={fediverse} homePath='.' />
            <section>
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url}>
                            <article>
                                {
                                    page.data.cover && <figure><img src={page.data.cover} /></figure>
                                }
                                <div>
                                    <h3>
                                        {page.data.title}
                                    </h3>
                                    <p>
                                        {page.data.description}
                                    </p>
                                    <div>
                                        <time dateTime={new Date(page.data.createdAt).toISOString()}>
                                            {new Date(page.data.createdAt).toLocaleDateString(lang, { dateStyle: 'full' })}
                                        </time>
                                        <T>
                                            read
                                        </T>
                                    </div>
                                </div>
                            </article>
                        </a>
                    ))
                }
            </section>
            <Footer />
        </main>
    );
}

export default withI18n(Index);