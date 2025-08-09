import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';
import { Wrapper } from './../types';

const HTML = ({ blog, content, page, post, style  }: Wrapper & { blog: Blog, post: Post }) => {
    return (
        <html lang={blog.lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/x-icon" href={blog.cover} />
                <title>{ `${post.title} - ${blog.name}`}</title>
                <link rel="stylesheet" href={style} />
                <meta property="og:title" content={post.title}/>
                <meta property="og:type" content="article"/>
                <meta property="og:url" content={page.url}/>
                { post.cover && <meta property="og:image" content={post.cover}/>}
                <meta property="og:description" content={post.description}/>
                <meta name="fediverse:creator" content={blog.fediverse} />
            </head>
            <body dangerouslySetInnerHTML={{ __html: content }}>
            </body>
        </html>
    )
}

export default HTML;