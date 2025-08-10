import { Blog } from 'types/src/Blog'
import { Post } from 'types/src/Post';

type Prefixed = {
    [Prop in Exclude<keyof Blog, "lang" | "fediverse"> as `blog${Capitalize<string & Prop>}`]: Blog[Prop];
}

export type TemplateBlog = Prefixed & {
    lang: string;
    fediverse?: string;

}

export type PageMeta = {
    outputPath: string
    url: string,
    data: Post
}

export interface EleventyTemplate {
    data: () => object
    render: (props: unknown) => Promise<string>,
    renderFile: (tmpl: string, props: unknown) => Promise<string>
}