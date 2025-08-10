import { Blog } from 'types/src/Blog'

export type TemplateBlog = {
    [Prop in keyof Blog as `blog${Capitalize<string & Prop>}`]: Blog[Prop]
}

export interface Template {
    data: () => object
    render: (props: unknown) => Promise<string>,
    renderFile?: (tmpl: string, props: unknown) => Promise<string>
}