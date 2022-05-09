import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const handler: NextApiHandler = async (request, response) => {
    switch (request.method) {
        case 'GET': {
            const { data: flows } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get('/flows', { params: { applicants: true } });
            response.status(200).send(flows);
            break;
        }
        case 'PUT': {
            const { data: flows } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put('/flows', request.body, { params: { applicants: true, ...request.query } });
            response.status(200).send(flows);
            break;
        }
        case 'DELETE': {
            break;
        }
    }
};

export default withApiAuthRequired(handler);