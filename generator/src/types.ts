import { Blog } from 'types/src/Blog'

type Prefixed = {
    [Prop in Exclude<keyof Blog, "lang" | "fediverse"> as `blog${Capitalize<string & Prop>}`]: Blog[Prop];
}

export type TemplateBlog = Prefixed & {
    lang: string;
    fediverse?: string;

}

export interface Template {
    data: () => object
    render: (props: unknown) => Promise<string>,
    renderFile?: (tmpl: string, props: unknown) => Promise<string>
}