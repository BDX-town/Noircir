import { useAppContext } from '../data/AppContext';
import { Link, Outlet } from 'react-router-dom';

import { Line, Button, useTranslations } from '@bdxtown/canaille';
import { PostLocation } from '../views/Locations';
import { Nav } from '../bits/Nav';
import { IconFeather } from '@tabler/icons-react';
import fr from './Base.fr-FR.i18n.json';

const tr = {
    "fr-FR": fr
}

export const Base = ({ write = false }: { write?: boolean }) => {
    const { blog } = useAppContext();
    const { T } = useTranslations("Base", tr)


    return (

        <main className='min-h-screen bg-additional-primary'>
            <div className='flex py-3 pl-3 gap-3 items-center'>
                <img src={blog?.blogCover} className='w-[45px] h-[45px] object-contain rounded-full' />
                <span className='text-xl font-bold'>{ blog?.blogName }</span>
                <div className='grow px-5 align-self-center'>
                    <Nav />
                </div>
            </div>
            <Line />
            <Outlet />
            {
                write && (
                    <Link className='fixed right-[20px] bottom-[32px]' to={PostLocation.path.replace(':file', '')}>
                        <Button className='text-2xl'><IconFeather /><T>write</T></Button>
                    </Link>
                )
            }
        </main>
    );
}