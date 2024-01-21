import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../data/AppContext';

import fr from './Base.fr-FR.i18n.json';
import { Button, useTranslations, Line } from '@bdxtown/canaille';
import { IconFeather, IconHome, IconPhoto, IconSettings2 } from '@tabler/icons-react';
import { Location as PostsLocation } from '../views/Posts';
import { Location as MediaLocation } from '../views/Media';
import { Location as BlogLocation } from '../views/Blog';
import { Location } from '../views/Post';

export const Base = () => {
    const { T } = useTranslations("Base", { "fr-FR": fr })
    const { blog, posts, media } = useAppContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const weight = React.useMemo(() => {
        return Math.floor(
            ((blog ? (new TextEncoder().encode(blog.name)).length : 0) +
            (blog ? (new TextEncoder().encode(blog.description)).length : 0) +
            (media?.reduce((acc, curr) => acc + curr.weight, 0) || 0)
            + (posts?.reduce((acc, curr) => acc + curr.weight, 0) || 0))
            / 10
        ) / 10;
    }, [blog, media, posts]);

    return (
        <main className='min-h-screen flex flex-row bg-additional-primary'>
            <div className='min-h-100 shrink-0 flex flex-col gap-4 px-5 my-5 overflow-hidden relative'>
                <Line className='absolute w-[100vh] origin-top-left rotate-90 left-[100%]' />
                <div className='text-center'>
                    <img className='rounded-full w-[50px] h-[50px]' src={blog?.picture} />
                    <h3 className='my-2'>
                        { blog?.name }
                    </h3>
                </div>
                <div>
                    <span>
                        <T weight={weight}>
                            weight
                        </T>
                    </span>
                    <ul className='list-none p-0'>
                        <li className='text-lg '>
                            <span className='font-bold'><T>posts</T>:</span> { posts?.length }
                        </li>
                        <li className='text-lg '>
                           <span className='font-bold'><T>media</T>:</span> { media?.length }
                        </li>
                    </ul>
                </div>
                <div className='grow'>
                    <p className='opacity-60 italic'>
                        { blog?.description }
                    </p>
                </div>
                <div className='text-center pb-3'>
                    <Link to={Location.path.replace(':file', '')}>
                        <Button size={50}><IconFeather /><T>write</T></Button>
                    </Link>
                </div>
            </div>
            <div className='grow flex flex-col'>
                <div className='px-5 shrink-0'>
                    <nav className='flex items-center justify-center py-4 gap-4'>
                        <label className='flex gap-2 items-center'>
                            <Button variant={pathname !== PostsLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(PostsLocation.path)}>
                                <IconHome />
                            </Button>
                            <T>posts</T>
                        </label>
                        <label className='flex gap-2 items-center'>
                            <Button variant={pathname !== MediaLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(MediaLocation.path)}>
                                <IconPhoto />
                            </Button>
                            <T>media</T>
                        </label>
                        <label className='flex gap-2 items-center'>
                            <Button variant={pathname !== BlogLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(BlogLocation.path)}>
                                <IconSettings2 />
                            </Button>
                            <T>blog</T>
                        </label>
                    </nav>
                    <Line className='mx-auto max-w-[900px]'/>
                </div>
                <Outlet />
            </div>
        </main>
    );
}