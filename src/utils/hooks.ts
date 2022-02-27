import { UserContext, useUser } from '@auth0/nextjs-auth0';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AUTH0_NAMESPACE } from '../constants/auth0';

import type { AppDispatch, AppState } from '../redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useUserInfo = () => {
	const { user, ...rest } = useUser();
	if (!user) {
		return rest as UserContext;
	}
	const id = user[AUTH0_NAMESPACE + '/dbID'];
	if (id && !user.id) user.id = id;
	delete user[AUTH0_NAMESPACE + '/dbID'];
	return { user, ...rest };
};