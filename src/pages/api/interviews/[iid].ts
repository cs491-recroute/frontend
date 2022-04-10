import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { iid } = request.query;

    switch (request.method) {
        case 'GET': {
            break;
        }
        case 'PUT': {
            const { data: interview } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/interview/${iid}/all`, request.body);
            response.status(200).send(interview);
            break;
        }
        case 'DELETE': {
            break;
        }
    }
};

export default withApiAuthRequired(handler);