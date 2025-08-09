import { Blog } from 'types/src/Blog'

export type TemplateBlog = {
    [Prop in keyof Blog as `blog${Capitalize<string & Prop>}`]: Blog[Prop]
}