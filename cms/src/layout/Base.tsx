import React from 'react';
import { Link, Outlet, useMatch } from 'react-router-dom';
import { useAppContext } from '../data/AppContext';

import fr from './Base.fr-FR.i18n.json';
import { Button, useTranslations, Line } from '@bdxtown/canaille';
import { IconFeather } from '@tabler/icons-react';
import { PostLocation } from '../views/Locations';
import { weight } from './../helpers/weight';

import { Nav } from '../bits/Nav';


export const Base = () => {
    const { T } = useTranslations("Base", { "fr-FR": fr })
    const { blog, posts, media } = useAppContext();

    const postMatch = useMatch(PostLocation.path);

    const cweight = React.useMemo(() => {
        return weight(
            ((blog ? (new TextEncoder().encode(blog.blogName)).length : 0) +
            (blog ? (new TextEncoder().encode(blog.blogDescription)).length : 0) +
            (media?.reduce((acc, curr) => acc + curr.weight, 0) || 0)
            + (posts?.reduce((acc, curr) => acc + curr.weight, 0) || 0))
        );
    }, [blog, media, posts]);

    return (
        <main className='h-screen flex flex-row bg-additional-primary overflow-hidden'>
            <div className='min-h-100 max-h-full w-[175px] shrink-0 relative flex flex-col'>
                <img className='mx-auto object-contain w-[70px] h-[70px] rounded-full mt-3' src={blog?.blogCover} />
                <div className='flex flex-col gap-4 px-3 grow'>
                    <Line className='absolute w-[100vh] origin-top-left rotate-90 top-0 left-[100%]' />
                    <div className='text-center'>
                        <h3 className='my-2'>
                            { blog?.blogName }
                        </h3>
                    </div>
                    <div>
                        <span>
                            <T weight={cweight}>
                                weight
                            </T>
                            <br />
                            <T>on-disk</T>
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
                    <p className='grow shrink opacity-60 italic my-0 min-h-[150px] overflow-auto'>
                        { blog?.blogDescription }
                    </p>
                    <div className='text-center pb-3'>
                        {
                            !postMatch && (
                                <Link to={PostLocation.path.replace(':file', '')}>
                                    <Button size={50}><IconFeather /><T>write</T></Button>
                                </Link>
                            )
                        }

                    </div>
                </div>
            </div>
            <div className='grow flex flex-col basis-0 overflow-auto'>
                <div className='px-5 shrink-0 pt-3'>
                    <Nav />
                </div>
                <Outlet />
            </div>
        </main>
    );
}