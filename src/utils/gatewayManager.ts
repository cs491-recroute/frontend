import Axios, { AxiosInstance } from 'axios';
import { SERVICES } from '../constants/services';

// eslint-disable-next-line no-unused-vars
type GatewayManager = AxiosInstance & { useService: (service: SERVICES) => AxiosInstance }
export const gatewayManager = Axios.create() as GatewayManager;

let interceptor: number;
gatewayManager.useService = (service: SERVICES): AxiosInstance => {
	if (interceptor) gatewayManager.interceptors.request.eject(interceptor);
	interceptor = gatewayManager.interceptors.request.use(req => {
		const endpoint = process.env[`${SERVICES[service]}_RUNNING`] ? 'localhost' : '92.205.57.121';
		const prefix = `http://${endpoint}:${service}`;
		if (!req.url?.startsWith(prefix)) req.url = prefix + req.url;
		return req;
	});
	return gatewayManager;
};