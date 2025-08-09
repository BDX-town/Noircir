import { Blog } from 'types/src/Blog'

// @ts-expect-error no typedef
import mastodon from './../misc/mastodon.svg?raw'
import { useMemo } from 'react';

export const Header = ({ blog, homePath }: { blog: Blog, homePath: string}) => {
    
    const fediverseUrl = useMemo(() => { 
        if(!blog.fediverse) return null;
        const [user, host] = blog.fediverse.slice(1).split('@');
        return `https://${host}/users/@${user}`;
    }, [blog.fediverse])

    return (
        <header>
            <div>
                <a href={homePath}>
                    <h1>{ blog.name }</h1>
                </a>
                <div>
                    {
                        fediverseUrl && (
                            <a href={fediverseUrl} target='_blank' style={{display: "inline-block", width: "32px", height: "32px"}} dangerouslySetInnerHTML={{__html: mastodon}}></a>
                        )
                    }
                </div>
            </div>
            <p>
                {blog.description}
            </p>
        </header>
    )
}