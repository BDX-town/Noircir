import { Block, useTranslations } from '@bdxtown/canaille';
import { useAppContext } from '../data/AppContext';
import { Link } from 'react-router-dom';
import { PostLocation } from './Locations';
import { weight } from '../helpers/weight';

import fr from './Posts.fr-FR.i18n.json';

export const Posts = () => {
    const { T } = useTranslations('Posts', { 'fr-FR': fr });
    const { posts } = useAppContext();

    return (
        <main className='p-5 flex gap-4 flex-wrap justify-center'>
            {
                posts?.map((post) => (
                    <Link key={post.file} className='grow no-underline text-grey-100' to={PostLocation.path + "/" + post.file}>
                        <Block className='flex p-0 overflow-hidden bg-additional-primary'>
                            <img src={post.cover} className='object-cover w-[200px] h-[130px]' />
                            <article className='flex flex-col p-3 grow'>
                                <h3 className='m-0'>{post.title}</h3>
                                <p className='grow'>{post.description}</p>
                                <div className='flex justify-between items-center opacity-60'>
                                    <T weight={weight(post.weight)}>on-disk</T>
                                    <time>{post.updatedAt.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric'})}</time>
                                </div>
                            </article>
                        </Block>
                    </Link>
                ))
            }
        </main>
    )
};

