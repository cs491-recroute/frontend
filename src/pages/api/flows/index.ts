import { getSession, Session } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { getUserID } from '../../../utils';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const getAllFlows: NextApiHandler = async (request, response) => {
	const { user } = getSession(request, response) as Session;
	const { data: flows } = await gatewayManager.useService(SERVICES.FLOW).get(`/${getUserID(user)}/flows`);
	response.json(flows);
};

export default getAllFlows;