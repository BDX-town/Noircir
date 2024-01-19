import { Block } from '@bdxtown/canaille';
import { useAppContext } from '../data/AppContext';
import { Link } from 'react-router-dom';
import { Location as PostLocation } from './Post';

export const Location = {
    path: '/posts',
}

export const Posts = () => {
    const { posts } = useAppContext();

    return (
        <main className='p-5 flex gap-4 flex-wrap justify-center'>
            {
                posts?.map((post) => (
                    <Link key={post.file} className='grow no-underline text-grey-100' to={PostLocation.path.replace(':file', post.file)}>
                        <Block className='flex p-0 overflow-hidden bg-additional-primary'>
                            <img src={post.cover} />
                            <article className='flex flex-col p-3 grow  '>
                                <h3 className='m-0'>{post.title}</h3>
                                <p className='grow'>{post.description}</p> 
                                <time className='w-full text-right opacity-60'>{post.updatedAt.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric'})}</time>
                            </article>
                        </Block>
                    </Link>
                ))
            }
        </main>
    )
};

