import { Post } from 'types/src/Post';
import { Blog } from 'types/src/Blog';

// import { useTranslations } from '@bdxtown/canaille';
import { withI18n } from './../withI18n';

import sanitizeHTML from './../sanitize'

// import fr from './Article.fr-FR.i18n.json';
import { Footer } from './Footer';
import { Header} from './Header';

const Article = ({ blog, post }: { blog: Blog, post: Post}) => {
    // const { T } = useTranslations('Article', { 'fr-FR': fr });
    const T = ({ children }: any) => children
    return (
        <main id='article'>
            <Header blog={blog} homePath='./..' />
            <article>
                <div>
                    <h2>
                        { post.title }
                    </h2>
                    <time dateTime={new Date(post.updatedAt).toISOString()}>
                        <T date={new Date(post.updatedAt).toLocaleDateString(blog.lang, { dateStyle: 'full' })}>date</T>
                    </time>
                    <div>
                        {
                            post.cover && <figure><img src={post.cover} /></figure>
                        }
                        <h3>
                            {post.description}
                        </h3>
                    </div>
                    <section>
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} />
                    </section>
                </div>
                <div />
            </article>
            <Footer />
        </main>
    )
}

export default withI18n(Article);