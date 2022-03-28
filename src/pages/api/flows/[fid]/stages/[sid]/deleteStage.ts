import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../../../constants/services';
import { gatewayManager } from '../../../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid, sid } = request.query;
    await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).delete(`/flow/${fid}/stage/${sid}`);
    response.status(200).send({sid});
};

export default withApiAuthRequired(handler);
