import { UserProfile } from '@auth0/nextjs-auth0';
import { AUTH0_NAMESPACE } from '../constants/auth0';

export const getUserID = (user: UserProfile): string => {
    if (!user) return '';
    return user[AUTH0_NAMESPACE + '/dbID'] as string;
};

export const translate = (string: string, mappings?: { [key: string]: any }) => {
    return string.replace(/\{([^}]+)\}/g, (match, key) => {
        return mappings && mappings[key] || match;
    });
};

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};