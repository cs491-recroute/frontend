import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../../../constants/services';
import { gatewayManager } from '../../../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid, cid } = request.query;
    await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).delete(`/form/${fid}/component/${cid}`);
    response.status(200).send({cid});
};

export default withApiAuthRequired(handler);