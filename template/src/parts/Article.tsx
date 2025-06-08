import React from 'react';

import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

import { useTranslations } from '@bdxtown/canaille';
import { withI18n } from './../withI18n';

import sanitizeHTML from './../sanitize'

import fr from './Article.fr-FR.i18n.json';
import { Footer } from './Footer';
import { Header} from './Header';

const Article: React.FC<Post & Blog> = ({ title, fediverse, lang, content, cover, description, updatedAt, ...rest }) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });
    return (
        <main id='article'>
            <Header {...rest} fediverse={fediverse} homePath='./..' />
            <article>
                <div>
                    <h2>
                        { title }
                    </h2>
                    <time dateTime={new Date(updatedAt).toISOString()}>
                        <T date={new Date(updatedAt).toLocaleDateString(lang, { dateStyle: 'full' })}>date</T>
                    </time>
                    <div>
                        {
                            cover && <figure><img src={cover} /></figure>
                        }
                        <h3>
                            {description}
                        </h3>
                    </div>
                    <section>
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }} />
                    </section>
                </div>
                <div />
            </article>
            <Footer />
        </main>
    )
}

export default withI18n(Article);