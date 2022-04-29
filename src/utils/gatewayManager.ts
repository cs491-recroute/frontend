import { getSession, Session } from '@auth0/nextjs-auth0';
import Axios, { AxiosInstance } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserID } from '.';
import { SERVICES } from '../constants/services';

// eslint-disable-next-line no-unused-vars
type GatewayManager = AxiosInstance & {
    useService: (service: SERVICES) => GatewayManager,
    addUser: (request: NextApiRequest, response: NextApiResponse) => GatewayManager
};

export const gatewayManager = Axios.create() as GatewayManager;
gatewayManager.interceptors.response.use(response => {
    delete gatewayManager.defaults.baseURL;
    delete gatewayManager.defaults.params;
    return response;
});

gatewayManager.useService = function (service: SERVICES): GatewayManager {
    this.defaults.baseURL = `${process.env[`${SERVICES[service]}_RUNNING`] ? 'http://localhost' : 'https://recroute.co'}:${service}`;
    return this;
};

gatewayManager.addUser = function (request: NextApiRequest, response: NextApiResponse): GatewayManager {
    const { user } = getSession(request, response) as Session;
    this.defaults.params = { ...this.defaults.params, userID: getUserID(user) }
    return this;
};