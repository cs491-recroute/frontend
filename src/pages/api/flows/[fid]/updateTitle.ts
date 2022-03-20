import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid } = request.query;
    const { data: flow } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/flow/${fid}`, request.body);
    response.status(200).send(flow);
};

export default withApiAuthRequired(handler);