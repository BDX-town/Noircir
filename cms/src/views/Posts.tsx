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

export const Posts = () => {
    const { T } = useTranslations('Posts', { 'fr-FR': fr });
    const { posts, client, blog } = useAppContext();

    
    if(!posts) {
        return (
            <div className='grow flex items-center justify-center'>
                <Loader />
            </div>
        )
    }

    return (
        <main className='p-5 flex flex-col gap-4 justify-center'>
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
                                    <a onClick={(e) => e.stopPropagation()} className='align-middle' href={buildLink(import.meta.env.VITE_SERVER, client as Webdav, blog, post)} target="_blank"><T>read</T><IconExternalLink className='ml-2 align-middle' size={16} /></a>
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

