import { Block, useTranslations } from '@bdxtown/canaille';
import { useAppContext } from '../data/AppContext';
import { Link } from 'react-router-dom';
import { PostLocation } from './Locations';
import { weight } from '../helpers/weight';

import fr from './Posts.fr-FR.i18n.json';
import { IconExternalLink } from '@tabler/icons-react';
import { buildLink } from '../services/posts';
import { Webdav } from '../services/webdav';
import { Loader } from '../bits/Loader';
import { useMemo } from 'react';

export const Posts = () => {
    const { T } = useTranslations('Posts', { 'fr-FR': fr });
    const { posts, client, blog, media} = useAppContext();

    const blogWeight = useMemo(() => {
        return weight(
            ((blog ? (new TextEncoder().encode(blog.blogName)).length : 0) +
            (blog ? (new TextEncoder().encode(blog.blogDescription)).length : 0) +
            (media?.reduce((acc, curr) => acc + curr.weight, 0) || 0)
            + (posts?.reduce((acc, curr) => acc + curr.weight, 0) || 0))
        );
    }, [blog, media, posts]);


    if(!posts) {
        return (
            <div className='grow flex items-center justify-center'>
                <Loader />
            </div>
        )
    }

    return (
        <main className='p-5 pb-[130px] flex flex-col gap-4 justify-center'>
            <div className='my-2'>
                <div className='text-2xl font-bold text-grey-100'>
                    <span className='text-3xl'>“</span> { blog?.blogDescription} <span className='text-3xl'>”</span>
                </div>
                <div className='flex gap-2 justify-end items-baseline mt-1'>
                    <span>
                        <span className='font-semibold text-lg'>
                            {posts?.length.toString().padStart(2, '0')}&nbsp;
                        </span>
                        <T>posts</T>
                    </span>
                    &
                    <span>
                        <span className='font-semibold text-lg'>
                            {media?.length.toString().padStart(2, '0')}&nbsp;
                        </span>
                        <T>media</T>
                    </span>
                </div>
                <div className='text-right'>
                    <T>weight</T> <T weight={blogWeight}>on-disk</T>
                </div>
            </div>
            {
                posts.map((post) => (
                    <Link key={post.file} className='no-underline text-grey-100' to={PostLocation.path + "/" + post.file}>
                        <Block variant='interactive' className='flex flex-col md:flex-row p-0 overflow-hidden bg-additional-primary min-h-[130px]'>
                            {
                                post.cover ? (
                                    <img className='w-full h-[150px] md:h-auto md:w-[130px] shrink-0 object-cover' src={post.cover} />
                                ) : (
                                    <div className='w-full h-[150px] md:h-auto md:w-[130px] shrink-0 object-cover bg-brand-primary' />
                                )
                            }
                            <article className='flex flex-col p-3 grow'>
                                <div className='flex'>
                                    <h3 className='m-0 grow'>{post.title}</h3>
                                    <a onClick={(e) => e.stopPropagation()} className='align-middle text-brand-primary-dark' href={buildLink(import.meta.env.VITE_SERVER, client as Webdav, blog, post)} target="_blank"><T>read</T><IconExternalLink className='ml-2 align-middle' size={16} /></a>
                                </div>
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

