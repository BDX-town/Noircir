import { useLocation, useNavigate } from 'react-router-dom';
import { Button, useTranslations } from '@bdxtown/canaille';

import { BlogLocation, PostsLocation, MediaLocation } from '../views/Locations';
import { IconHome, IconPhoto, IconSettings2 } from '@tabler/icons-react';

import fr from './Nav.fr-FR.i18n.json';

export const Nav = () => {
    const { T } = useTranslations('Nav', { 'fr-FR': fr });
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
        <nav className='flex items-center justify-end gap-4 text-sm'>
            <label className='flex gap-2 items-center'>
                <Button variant={pathname !== PostsLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(PostsLocation.path)}>
                    <IconHome size={20} />
                </Button>
                <T>posts</T>
            </label>
            <label className='flex gap-2 items-center'>
                <Button variant={pathname !== MediaLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(MediaLocation.path)}>
                    <IconPhoto size={20}  />
                </Button>
                <T>media</T>
            </label>
            <label className='flex gap-2 items-center'>
                <Button variant={pathname !== BlogLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(BlogLocation.path)}>
                    <IconSettings2 size={20}  />
                </Button>
                <T>blog</T>
            </label>
        </nav>
    )
};