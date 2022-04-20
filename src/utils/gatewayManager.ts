import { getSession, Session } from '@auth0/nextjs-auth0';
import Axios, { AxiosInstance } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserID } from '.';
import { SERVICES } from '../constants/services';

// eslint-disable-next-line no-unused-vars
type GatewayManager = AxiosInstance & { useService: (service: SERVICES) => GatewayManager, addUser: (request: NextApiRequest, response: NextApiResponse) => GatewayManager }
export const gatewayManager = Axios.create() as GatewayManager;

let useServiceInterceptor: number;
gatewayManager.useService = (service: SERVICES): GatewayManager => {
    if (useServiceInterceptor) gatewayManager.interceptors.request.eject(useServiceInterceptor);
    useServiceInterceptor = gatewayManager.interceptors.request.use(req => {
        const endpoint = process.env[`${SERVICES[service]}_RUNNING`] ? 'http://localhost' : 'https://recroute.co';
        const prefix = `${endpoint}:${service}`;
        if (!req.url?.startsWith(prefix)) req.url = prefix + req.url;
        return req;
    });
    return gatewayManager;
};

let addUserInterceptor: number;
gatewayManager.addUser = (request: NextApiRequest, response: NextApiResponse): GatewayManager => {
    const { user } = getSession(request, response) as Session;
    if (addUserInterceptor) gatewayManager.interceptors.request.eject(addUserInterceptor);
    addUserInterceptor = gatewayManager.interceptors.request.use(req => {
        if (user) {
            req.params = { ...req.params, userID: getUserID(user) };
        }
        return req;
    });
    return gatewayManager;
};