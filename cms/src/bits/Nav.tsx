import { useLocation, useNavigate } from 'react-router-dom';
import { Button, useTranslations } from '@bdxtown/canaille';

import { BlogLocation, PostsLocation, MediaLocation, SettingsLocation } from '../views/Locations';
import { IconHome, IconPhoto, IconSettings2, IconSettings, IconLogout } from '@tabler/icons-react';

import { Sync } from './Sync';

import fr from './Nav.fr-FR.i18n.json';
import { useCallback } from 'react';

export const Nav = () => {
    const { T } = useTranslations('Nav', { 'fr-FR': fr });
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const logout = useCallback(() => {
        sessionStorage.clear();
        window.location.reload();
    }, [])

    return (
        <nav className='flex items-center justify-between gap-4 text-lg'>
            <div className='grow'>
                <Sync />
            </div>
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
            <label className='flex gap-2 items-center'>
                <Button variant={pathname !== SettingsLocation.path ? 'secondary' : undefined} size={50} onClick={() => navigate(SettingsLocation.path)}>
                    <IconSettings size={20}  />
                </Button>
                <T>settings</T>
            </label>
            <label className='flex gap-2 items-center'>
                <Button variant="secondary" size={50} onClick={logout}>
                    <IconLogout size={20}  />
                </Button>
            </label>
        </nav>
    )
};