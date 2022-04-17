import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    console.log(request.body);
    const { data: question } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/templates/question`, request.body);
    return response.status(200).send(question);

};

export default withApiAuthRequired(handler);