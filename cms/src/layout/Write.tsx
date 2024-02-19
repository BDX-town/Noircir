import { Outlet } from 'react-router-dom';
import { useAppContext } from '../data/AppContext';

import { Line } from '@bdxtown/canaille';
import { Nav } from '../bits/Nav';


export const Write = () => {
    const { blog } = useAppContext();


    return (

        <main className='min-h-screen bg-additional-primary'>
            <div className='flex'>
                <div className='w-[150px] border-0 border-r-2 border-solid border-grey-100 bg-cover bg-center' style={{ backgroundImage: `url(${blog?.blogCover})` }}></div>
                <div className='grow px-5 align-self-center py-3'>
                    <Nav />
                </div>
            </div>
            <Line />
            <Outlet />
        </main>
    );
}