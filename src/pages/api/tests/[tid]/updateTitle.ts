import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { tid } = request.query;
    const { data: test } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/test/${tid}`, request.body);
    response.status(200).send(test);
};

export default withApiAuthRequired(handler);