import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../data/AppContext';

import fr from './Base.fr-FR.i18n.json';
import { Button, useTranslations, Line } from '@bdxtown/canaille';
import { IconHome, IconPhoto, IconSettings2 } from '@tabler/icons-react';
import { BlogLocation, PostsLocation, MediaLocation } from '../views/Locations';


export const Write = () => {
    const { T } = useTranslations("Base", { "fr-FR": fr })
    const { blog } = useAppContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();


    return (

        <main className='min-h-screen bg-additional-primary'>
            <div className='flex'>
                <div className='w-[150px] border-0 border-r-2 border-solid border-grey-100 bg-cover bg-center' style={{ backgroundImage: `url(${blog?.blogCover})` }}></div>
                <div className='grow px-5 align-self-center sm:ml-[-150px] ml-0'>
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
                </div>
            </div>
            <Line />
            <Outlet />
        </main>
    );
}