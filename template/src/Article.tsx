import React from 'react';

import { useTranslations } from '@bdxtown/canaille';

import { IArticle } from './types';
import { withI18n } from './withI18n';

import fr from './Article.fr-FR.i18n.json';

const Article: React.FC<IArticle> = ({ title, cover, description, content, blogName, blogDescription, updatedAt, lang }) => {
    const { T } = useTranslations('Article', { 'fr-FR': fr });

    return (
        <article>
            <img className='w-full h-[300px]' src={cover} />
            <div>
                <h1>{ title }</h1>
                <span>
                    <T date={new Date(updatedAt).toLocaleDateString(lang)}>date</T>
                </span>
            </div>
            

        </article>
    );
}

export default withI18n(Article);