import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
	const { fid } = request.query;
	const { data: stage } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/flow/${fid}/stage`, request.body);
	response.status(200).send(stage);
};

export default withApiAuthRequired(handler);