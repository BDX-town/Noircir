import React from 'react';

import { Button, useTranslations } from '@bdxtown/canaille';
import { IconDeviceFloppy } from '@tabler/icons-react';

import fr from './Settings.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { Password } from '../bits/Password';


export const Settings = () => {
    const form = React.useRef<HTMLFormElement>(null);
    const { T } = useTranslations('Settings', { 'fr-FR': fr });
    const { actions } = useAppContext();
    const { changePassword, logout } = actions;


    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);

        const password = data.get("password");
        const passwordConfirm = data.get("password-confirm");

        if(!password || !passwordConfirm || password !== passwordConfirm) return;

        await changePassword(password as string);
        // TODO: feedback
        logout();
    }, [changePassword, logout]);



    return (
        <form ref={form} className='grow flex flex-col' onSubmit={onSubmit}>
            <div className='p-4'>
                <div className=''>
                    <h2 className='mb-2'><T>auth</T></h2>
                    <p className='text-sm text-gray-700 mb-4'><T>will-deconnect</T></p>
                    <Password />
                </div>

            </div>
            <div className='sticky text-right p-3'>
                <Button htmlType='submit' size={50}><IconDeviceFloppy /> <T>apply</T></Button>
            </div>
        </form>
    );
}