import { Blog } from 'types/src/Blog'

// @ts-expect-error no typedef
import mastodon from './../misc/mastodon.svg?raw'
import { useMemo } from 'react';

export const Header = ({ blogName, blogDescription, fediverse, homePath } : Omit<Blog & { homePath: string }, "lang">) => {
    
    const fediverseUrl = useMemo(() => { 
        if(!fediverse) return null;
        const [user, host] = fediverse.slice(1).split('@');
        return `https://${host}/users/@${user}`;
    }, [fediverse])

    return (
        <header>
            <div>
                <a href={homePath}>
                    <h1>{ blogName }</h1>
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
                {blogDescription}
            </p>
        </header>
    )
}