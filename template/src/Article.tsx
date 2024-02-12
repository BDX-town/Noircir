import React from 'react';

import { IArticle } from './types';

import { Line, StyleMeta } from '@bdxtown/canaille';

import { useTranslations } from '@bdxtown/canaille';
import { withI18n } from './withI18n';


import fr from './Article.fr-FR.i18n.json';

const Base: React.FC<IArticle> = ({ title, blogName, lang, content, blogCover, style, cover, description, updatedAt }: IArticle) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });

    return (
        <html lang={lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title} - {blogName}</title>
                <link rel="stylesheet" href={style} />
                <style dangerouslySetInnerHTML={{__html: StyleMeta.layerSheet.style.join('\n') }} />
                <style dangerouslySetInnerHTML={{__html: StyleMeta.staticSheet.style.join('\n') }} />
                <style dangerouslySetInnerHTML={{__html: StyleMeta.dynamicSheet.style.join('\n') }} />
            </head>
            <body className='bg-additional-primary'>
                <header className='p-3'>
                    <div className='flex items-center gap-2'>
                        <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                        <h1>
                            { blogName }
                        </h1>
                    </div>
                    <Line />
                </header>
                <main>
                    <article className='bg-additional-primary'>
                        <img className='w-full h-[300px] object-cover' src={cover} />
                        <section>
                            <h1 className='mb-2 text-center'>{ title }</h1>
                            <div className='text-center'>
                                <T date={new Date(updatedAt).toLocaleDateString(lang)}>date</T>
                            </div>
                            <h4 className='p-3 max-w-[800px]'>
                                { description }
                            </h4>
                        </section>
                        {
                            // TODO: sanitize what's outputed (?) here
                        }
                        <section className='p-3 max-w-[800px]' dangerouslySetInnerHTML={{ __html: content }} />
                    </article>
                </main>
            </body>
        </html>
    )
}

export default withI18n(Base);