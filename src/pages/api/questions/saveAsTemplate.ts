import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    try {
        // eslint-disable-next-line max-len
        const { data: question } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/templates/question?accessModifier=${request.body.accessModifier}`, request.body.questionData);
        return response.status(200).send(question);
    } catch (error: any) {
        return response.status(400).send(error.message);
    }

};

export default withApiAuthRequired(handler);