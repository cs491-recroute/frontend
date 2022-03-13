import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const createFlow: NextApiHandler = async (request, response) => {
    const { data: flow } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post('/flow', request.body);
    response.status(200).send(flow);
};

export default withApiAuthRequired(createFlow);