import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { data: categories } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get(`/question/category`);
    response.status(200).send(categories);
};

export default withApiAuthRequired(handler);