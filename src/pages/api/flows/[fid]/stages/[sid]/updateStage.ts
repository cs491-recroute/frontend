import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../../../constants/services';
import { gatewayManager } from '../../../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid, sid} = request.query;
    const { data } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/flow/${fid}/stage/${sid}/all`, request.body);
    response.status(200).send(data);
};

export default withApiAuthRequired(handler);