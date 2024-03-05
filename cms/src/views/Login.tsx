import React from 'react';
import { Block, TextInput, useTranslations } from '@bdxtown/canaille';
import { IconLogin2 } from '@tabler/icons-react';

import fr from './Login.fr-FR.i18n.json';
import { LOGIN_FAIL, useAppContext } from '../data/AppContext';
import { useNavigate } from 'react-router-dom';
import { ButtonProcess } from '../bits/ButtonProcess';
import { AppError } from '../data/AppError';

export const Login = () => {
    const { T, __ } = useTranslations('Login', { 'fr-FR': fr });
    const { actions } = useAppContext();
    const { login, refresh } = actions;
    const navigate = useNavigate();

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState<AppError | undefined>(undefined);

    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        try {
            setProcessing(true);
            const client = await login(data.get('username') as string, data.get('password') as string);
            await refresh(client);
            navigate('/');
        } catch (e) {
            if((e as AppError).code === LOGIN_FAIL) setError(e as AppError);
            else throw e;
        } finally {
            setProcessing(false);
        }
    }, [login, navigate, refresh]);

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-additional-primary gap-4'>
            <div className='flex flex-col gap-3'>
                <div className='flex gap-3 items-end'>
                    <img className='w-[50px]' src='/favicon.webp' alt="Noircir's logo" aria-hidden />
                    <h1 className='my-0'>Noircir</h1>
                </div>
                <Block className='bg-additional-primary w-[400px]'>
                    <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                        <TextInput required name='username' label={__('username')} />
                        <TextInput required name='password' htmlType='password' label={__('password')} />
                        <div className='text-right'>
                            <ButtonProcess processing={processing} error={error} size={50} htmlType="submit">
                                <IconLogin2 /> <T>login</T>
                            </ButtonProcess>
                        </div>
                    </form>
                </Block>
            </div>
        </div>
    )
};