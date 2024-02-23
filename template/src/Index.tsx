import React from 'react';

import { Line, Block } from '@bdxtown/canaille';

import { useTranslations } from '@bdxtown/canaille';
import { withI18n } from './withI18n';


import fr from './Article.fr-FR.i18n.json';

const Index: React.FC = ({ blogName, blogDescription, blogCover, pages }: any) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });

    return (
        <>
            <header className='p-3'>
                <div className='flex items-center gap-3'>
                    <img className='rounded-full w-[50px] h-[50px]' src={blogCover} />
                    <h1>
                        { blogName }
                    </h1>
                </div>
                <Line />
                <p className='px-3 mx-auto max-w-[800px]' dangerouslySetInnerHTML={{ __html: blogDescription}} />
            </header>
            <main className='p-3 mx-auto max-w-[800px] flex flex-col gap-4'>
                {
                    pages.map((page: any) => (
                        <a href={page.page.url} key={page.page.url} className="no-underline">
                            <Block className='bg-additional-primary text-grey-100 overflow-hidden p-0'>
                                <article>
                                    <img className='w-full h-[100px] object-cover' src={page.data.cover} />
                                    <div className='p-3'>
                                        <h2 className='m-0 mb-3'>
                                            { page.data.title }
                                        </h2>
                                        <p className='m-0'>
                                            { page.data.description }
                                        </p>
                                    </div>
                                </article>
                            </Block>
                        </a>
                    ))  
                }
            </main>
        </>
    );
}

export default withI18n(Index);