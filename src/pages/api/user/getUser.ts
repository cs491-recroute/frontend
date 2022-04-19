import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { data: user } = await gatewayManager.useService(SERVICES.USER).addUser(request, response).get(`/user`);
    response.status(200).send(user);
};

export default withApiAuthRequired(handler);