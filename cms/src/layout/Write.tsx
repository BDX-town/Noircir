import { Outlet } from 'react-router-dom';
import { useAppContext } from '../data/AppContext';

import { Line } from '@bdxtown/canaille';
import { Nav } from '../bits/Nav';


export const Write = () => {
    const { blog } = useAppContext();


    return (

        <main className='min-h-screen bg-additional-primary'>
            <div className='flex py-3 pl-3 items-center'>
                <img src={blog?.blogCover} className='w-[45px] h-[45px] object-contain rounded-full' />
                <div className='grow px-5 align-self-center'>
                    <Nav />
                </div>
            </div>
            <Line />
            <Outlet />
        </main>
    );
}