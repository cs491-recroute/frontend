import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { flowID } = request.query;
    const { data: result } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/flow/${flowID}/submissions`, request.body);
    response.status(200).send(result);
};

export default withApiAuthRequired(handler);