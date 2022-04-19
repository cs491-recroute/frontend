import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid } = request.query;
    const { mail } = request.body;
    try {
        await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/flow/${fid}/invite/${mail}`);
        response.status(200).send('OK');
    } catch ({ response: { data: { message } } }: any) {
        response.status(400).send(message);
    }
};

export default withApiAuthRequired(handler);