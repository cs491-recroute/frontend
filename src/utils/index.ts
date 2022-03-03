import { UserProfile } from '@auth0/nextjs-auth0';
import { AUTH0_NAMESPACE } from '../constants/auth0';

export const getUserID = (user: UserProfile): string => {
	if (!user) return '';
	return user[AUTH0_NAMESPACE + '/dbID'] as string;
};

export const translate = (string: string) => string;