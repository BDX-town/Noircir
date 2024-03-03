import React from 'react';

import { useTranslations, Block, Button } from '@bdxtown/canaille';

import fr from './Invite.fr-FR.i18n.json';
import { useNavigate, useParams } from 'react-router-dom';
import { Password } from '../bits/Password';
import { IconPassword } from '@tabler/icons-react';
import { useAppContext } from '../data/AppContext';
import { changePassword } from '../services/settings';

export const Invite = () => {
    const { T, __ } = useTranslations('Invite', { "fr-FR": fr });
    const params = useParams();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | undefined>(undefined);

    const { actions } = useAppContext();
    const { login, refresh } = actions;

    const credentials = React.useMemo(() => {
        if(!params.token) return null;
        const token = atob(params.token);
        const match = token.match(/(.+):(.+)/);
        if(!match) return null;
        const username = match[1];
        const password = match[2];

        return {
            username,
            password
        }
    }, [params]);

    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        if(!credentials) return;
        const data = new FormData(e.target as HTMLFormElement);
        const newPassword = data.get("password") as string;
        const { username, password } = credentials;
        try {
            const client = await login(username, password, true);
            await changePassword(client, newPassword);
        } catch (e) {
            const err = e as Error;
            if(err.message.indexOf("401") !== -1) {
                setError(__("invalid"));
                return;
            }
            throw e;
        }
        await login(username, newPassword);
        await refresh();
        navigate('/');
        // TODO: feedback
    }, [__, credentials, login, navigate, refresh]);

    return (
        <>
            <div className='min-h-screen flex flex-col justify-center items-center bg-additional-primary'>
                <img className='w-[70px]' src='/favicon.webp' alt="Noircir's logo" aria-hidden />
                <div>
                    <h1>
                        {
                            credentials ? <T>welcome</T> : <T>error</T>
                        }
                    </h1>
                </div>
                <Block className='bg-additional-primary flex flex-col gap-4'>
                    {
                        !credentials ? (
                            <T>invalid</T>
                        ) : (
                            <>
                                <p className='text-center'>
                                    <T>description</T>
                                    {
                                        error && <p className='max-w-[600px] mx-auto text-red-700'>{error}</p>
                                    }
                                </p>
                                <form onSubmit={onSubmit} onChange={() => setError(undefined)}>
                                    <Password required />
                                    <div className='text-right mt-4'>
                                        <Button htmlType='submit' size={50}><IconPassword /> <T>apply</T></Button>
                                    </div>
                                </form>
                            </>
                        )
                    }

                </Block>
            </div>
        </>
    )

};