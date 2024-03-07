import React from 'react';

import { useTranslations } from '@bdxtown/canaille';
import { IconDeviceFloppy } from '@tabler/icons-react';

import fr from './Settings.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { Password } from '../bits/Password';
import { AppError } from '../data/AppError';
import { ButtonProcess } from '../bits/ButtonProcess';
import { GENERATE_PASSWORD_FAIL, CHANGE_PASSWORD_DENY, CHANGE_PASSWORD_FAIL, CHANGE_PASSWORD_FALSE, CHANGE_PASSWORD_NOTFOUND, GENERATE_PASSWORD_DENY, GENERATE_PASSWORD_NOTFOUND } from '../services/settings';

const ERRORS = [
    GENERATE_PASSWORD_FAIL,
    GENERATE_PASSWORD_DENY,
    GENERATE_PASSWORD_NOTFOUND,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_DENY,
    CHANGE_PASSWORD_NOTFOUND,
    CHANGE_PASSWORD_FALSE,
]

export const Settings = () => {
    const form = React.useRef<HTMLFormElement>(null);
    const { T } = useTranslations('Settings', { 'fr-FR': fr });
    const { actions } = useAppContext();
    const { changePassword, logout } = actions;

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState<AppError | undefined>(undefined);
    const [success, setSuccess] = React.useState<string | undefined>(undefined);


    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);

        const password = data.get("password");
        const passwordConfirm = data.get("password-confirm");

        if(!password || !passwordConfirm || password !== passwordConfirm) return;

        setProcessing(true);
        setError(undefined);
        setSuccess(undefined);
        try {
            await changePassword(password as string);
            logout();
        } catch (e) {
            const appError = e as AppError;
            if(ERRORS.indexOf(appError.code) !== -1) setError(appError);
            else throw e;
        } finally {
            setProcessing(false);
        }
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
                <ButtonProcess htmlType='submit' size={50} processing={processing} error={error} success={success} ><IconDeviceFloppy /> <T>apply</T></ButtonProcess>
            </div>
        </form>
    );
}