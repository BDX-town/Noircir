import React from 'react';

import { useTranslations, TextInput } from '@bdxtown/canaille';

const pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&]).{12,}$"

import fr from './Password.fr-FR.i18n.json';

export const Password = () => {
    const root = React.useRef<HTMLFieldSetElement>(null);
    const { T, __ } = useTranslations('Password', { 'fr-FR': fr });

    const [passwordChanged, setPasswordChanged] = React.useState(false);

    const checkValidity = React.useCallback((value: unknown) => {
        const data = new FormData(root.current?.form as HTMLFormElement);
        const password = data.get("password");
        const passwordConfirm = value as string;
        return password !== passwordConfirm ? __('dont-match') : undefined;
    }, [__]);

    return (
        <fieldset ref={root} className='border-0 flex flex-col gap-4 p-0' onChange={() => setPasswordChanged(true)}>
            <div>
                <TextInput name="password" minLength={12} pattern={pattern} required={passwordChanged} placeholder="•••••••••••••••" htmlType='password' label={<T>password</T>} />
                <div className='mt-1 text-sm text-gray-700'><T>hint</T></div>
            </div>
            <div>
                <TextInput name="password-confirm" checkValidity={checkValidity} minLength={12} pattern={pattern} required={passwordChanged} placeholder="•••••••••••••••" htmlType='password' label={<T>password-confirm</T>} />
            </div>
        </fieldset>
    );
}