import { useRouteError } from 'react-router-dom';
import { Error } from './../data/ErrorBoundary';
import { AppError } from '../data/AppError';

export const ErrorElement = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className='p-4'>
            <Error error={error as AppError} />
        </div>
    )
}