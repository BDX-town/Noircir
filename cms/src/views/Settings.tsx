import React from 'react';

import { TextInput, Button, useTranslations } from '@bdxtown/canaille';

import fr from './Settings.fr-FR.i18n.json';

export const Settings = () => {
    const { T } = useTranslations('Settings', { 'fr-FR': fr });

    const [passwordChanged, setPasswordChanged] = React.useState(false);

    const onSubmit: React.FormEventHandler = React.useCallback((e) => {

    }, []);

    return (
        <form className='grow flex flex-col' onSubmit={onSubmit}>
            <div className='grow p-4'>
                <div className=''>
                    <h2><T>auth</T></h2>
                    <fieldset className='border-0 flex flex-col gap-4' onChange={() => setPasswordChanged(true)}>
                        <TextInput name="password" required={passwordChanged} placeholder="•••••••••••••••" htmlType='password' label={<T>password</T>} />
                        <TextInput name="password-confirm" required={passwordChanged} placeholder="•••••••••••••••" htmlType='password' label={<T>password-confirm</T>} />
                    </fieldset>
                </div>

            </div>
            <div className='sticky text-right p-3'>
                <Button size={50}><T>apply</T></Button>
            </div>
        </form>
    );
}