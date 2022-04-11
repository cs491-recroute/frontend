import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { cid } = request.query;

    switch(request.method) {
        case 'GET': {
            const { data: questions } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get(`/question/category/${cid}`);
            response.status(200).send(questions);
            break;
        }
        case 'UPDATE': {
            // TODO: Update category whose id is cid
            break;
        }
        case 'DELETE': {
            // TODO: Delete category whose id is cid
            break;
        }
    }
};

export default withApiAuthRequired(handler);