import { Blog } from 'types/src/Blog';
import { Post } from 'types/src/Post';
import { Footer } from './Footer'

import { Header } from './Header';
// import { useTranslations } from '@bdxtown/canaille';

/**
 * Eleventy generated collection data
 */
type Collection = Array<{
    data: Post,
    page: {
        url: string,
    }
}>

// import fr from './Index.fr-FR.i18n.json'

const Index = ({ pages, blog }: { pages: Collection, blog: Blog}) => {
    // const { T } = useTranslations("Index", { "fr-FR": fr })
    const T = ({ children }: any) => children
    return (
        <main id='index'>
            <Header blog={blog} homePath='.' />
            <section>
                {
                    pages.map((page) => (
                        <a href={page.page.url} key={page.page.url}>
                            <article>
                                {
                                    page.data.cover && <figure><img src={page.data.cover} /></figure>
                                }
                                <div>
                                    <h3>
                                        {page.data.title}
                                    </h3>
                                    <p>
                                        {page.data.description}
                                    </p>
                                    <div>
                                        <time dateTime={new Date(page.data.createdAt).toISOString()}>
                                            {new Date(page.data.createdAt).toLocaleDateString(blog.lang, { dateStyle: 'full' })}
                                        </time>
                                        <T>
                                            read
                                        </T>
                                    </div>
                                </div>
                            </article>
                        </a>
                    ))
                }
            </section>
            <Footer />
        </main>
    );
}

export default Index;