import React from 'react';
import { useTranslations } from '@bdxtown/canaille';

import fr from "./ErrorElement.fr-FR.i18n.json";
import { useRouteError } from 'react-router-dom';

enum ERROR_TYPE {
    OFFLINE = "offline",
}

export const ErrorElement = () => {
    const { __ } = useTranslations('ErrorElement', { 'fr-FR': fr });

    const error = useRouteError();
    console.error(error);

    const type = React.useMemo(() => {
        const e = error as Error;
        if(e.message.indexOf('loading dynamically imported module') !== -1) {
            return ERROR_TYPE.OFFLINE;
        }
    }, [error]);


    return (
        <div className='p-4'>
            <h2>
                { __(`${type}.title`) }
            </h2>
            <p>
                { __(`${type}.description`) }
            </p>
        </div>
    )
}