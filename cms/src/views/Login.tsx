import React from 'react';
import { Block, TextInput, Button, useTranslations } from '@bdxtown/canaille';
import { IconLogin2 } from '@tabler/icons-react';

import fr from './Login.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { T, __ } = useTranslations('Login', { 'fr-FR': fr });
    const { actions } = useAppContext();
    const { login, refresh } = actions;
    const navigate = useNavigate();

    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        try {
            const client = await login(data.get('username') as string, data.get('password') as string);
            await refresh(client);
            navigate('/');
        } catch (e: unknown) {
            // TODO: handle error
            console.log(e);
        }
    }, [login, navigate, refresh]);

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-additional-primary gap-4'>
            <div className='flex flex-col gap-3'>
                <div className='flex gap-3 items-end'>
                    <img className='w-[50px]' src='/favicon.webp' alt="Noircir's logo" aria-hidden />
                    <h1 className='my-0'>Noircir</h1>
                </div>
                <Block className='bg-additional-primary'>
                    <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                        <TextInput name='username' label={__('username')} />
                        <TextInput name='password' htmlType='password' label={__('password')} />
                        <div className='text-right'>
                            <Button htmlType='submit' size={50}>
                                <IconLogin2 /> <T>login</T>
                            </Button>
                        </div>
                    </form>
                </Block>
            </div>
        </div>
    )
};