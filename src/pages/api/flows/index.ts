import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const getAllFlows: NextApiHandler = async (request, response) => {
    const { data: flows } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get('/flows');
    response.json(flows);
};

export default withApiAuthRequired(getAllFlows);