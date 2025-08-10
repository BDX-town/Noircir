import ReactDOM from 'react-dom/server.js'
import React from 'react'
import 'react/jsx-runtime.js'
// @ts-expect-error no typedef
import path from 'path'
// @ts-expect-error no typedef
import fs from 'fs'

import { TemplateBlog, EleventyTemplate, PageMeta } from './types'

import { Post } from 'types/src/Post'

import { Article as ArticleComponent } from 'template'
import { Blog } from 'types/src/Blog'

type ArticleProps = TemplateBlog & Post & { page: PageMeta }

class Article implements EleventyTemplate {
    data() {
        return {
            templateEngineOverride: "11ty.js, md",
            layout: "htmlArticle.11ty.js",
        }
    }

    renderFile: (tmpl: string, props: unknown) => Promise<string>

    /**
     * This weird function is in charge of generating the blog's index. At this time, I didn't find a way to do this properly while keeping the
     * desired file structure
     */
    async updateIndex(props: ArticleProps) {
        const blogPath = path.dirname(
            path.dirname(
                props.page.outputPath
            )
        ) ;
        fs.mkdirSync(blogPath, { recursive: true })
        const indexOutputPath = path.join(
            blogPath,
            "index.html"
        );

        const content = await this.renderFile('./_includes/index.11ty.js', { ...props });
        const wrapper = await this.renderFile('./_includes/htmlIndex.11ty.js', { ...props, content })
        fs.writeFileSync(indexOutputPath, wrapper);
    }

    async render(props: ArticleProps) {

        await this.updateIndex(props);
        const blog: Blog = {
            cover: props.blogCover,
            description: props.blogDescription,
            lang: props.lang as Blog["lang"],
            name: props.blogName,
            fediverse: props.fediverse
        }

        const post: Post = {
            content: props.content,
            createdAt: props.createdAt,
            description: props.description,
            draft:props.draft,
            file: props.file,
            title: props.title,
            updatedAt: props.updatedAt,
            weight: props.weight,
            cover: props.cover
        }


        return ReactDOM.renderToStaticMarkup(React.createElement(ArticleComponent, { ...props, blog, post  }));
    }
}

export default Article