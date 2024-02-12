import translate from 'counterpart';
import React from 'react';
import { TranslationContext } from '@bdxtown/canaille';
import { IArticle } from './types';

export function withI18n(Cmp: React.FC<IArticle>) {
    return ({ lang, ...rest }: IArticle) => <TranslationContext defaultLang={lang} __={translate}><Cmp lang={lang} {...rest} /></TranslationContext>
}