import { Wrapper } from './../types';
import { Blog } from 'types/src/Blog';

const HTML = ({ blog, content, page, style  }: Wrapper & { blog: Blog }) => {
    return (
        <html lang={blog.lang.split('-')[0]}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/x-icon" href={blog.cover} />
                <title>{ blog.name}</title>
                <link rel="stylesheet" href={style} />
                <meta property="og:title" content={blog.name}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={page.url}/>
                <meta property="og:image" content={blog.cover}/>
                <meta property="og:description" content={blog.description}/>
                <meta name="fediverse:creator" content={blog.fediverse} />
            </head>
            <body dangerouslySetInnerHTML={{ __html: content }}>
            </body>
        </html>
    )
}

export default HTML;