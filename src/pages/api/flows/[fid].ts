import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid } = request.query;

    switch (request.method) {
        case 'GET': {
            const { data: flow } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get(`/flow/${fid}`, { params: { applicants: true } });
            response.status(200).send(flow);
            break;
        }
        case 'PUT': {
            const { data: flow } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/flow/${fid}`, request.body, { params: { applicants: true } });
            response.status(200).send(flow);
            break;
        }
        case 'DELETE': {
            await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).delete(`/flow/${fid}`);
            response.status(200).send(fid);
            break;
        }
    }
};

export default withApiAuthRequired(handler);