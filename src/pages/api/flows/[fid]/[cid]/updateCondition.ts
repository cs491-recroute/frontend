import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../../constants/services';
import { gatewayManager } from '../../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid, cid} = request.query;
    try {
        const { data } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/flow/${fid}/condition/${cid}`, request.body);
        response.status(200).send(data);
    } catch ({ response: { data: { message } } }: any) {
        response.status(400).send(message);
    }

};

export default withApiAuthRequired(handler);