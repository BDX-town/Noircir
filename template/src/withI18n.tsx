// import translate from 'counterpart';
import React from 'react';
import { Blog } from 'types/src/Blog';


export function withI18n(Cmp: React.FC<Blog & any>) {
    // return ({ lang, ...rest }: Blog) => <TranslationContext defaultLang={lang} __={translate}><Cmp lang={lang} {...rest} /></TranslationContext>
    return ({ lang, ...rest }: Blog) => <><Cmp lang={lang} {...rest} /></>
}