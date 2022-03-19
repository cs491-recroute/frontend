import { useRouter } from 'next/router';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppState } from '../redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useRouterWithReturnBack = () => {
    const router = useRouter();
    const { query: { returnTo }, push, asPath } = router;
    const pushWithReturn = (url: string): void => {
        const query = `?returnTo=${asPath}`;
        push(url + query, url);
    }
    const returnBack = () => {
        if (returnTo) push(returnTo.toString());
    }
    return {
        pushWithReturn,
        returnBack,
        returnAvailable: !!returnTo,
        ...router
    }
}