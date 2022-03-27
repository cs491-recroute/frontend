import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { tid } = request.query;

    switch (request.method) {
        case 'POST': {
            const { data: test } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/test/${tid}/question`, request.body);
            return response.status(200).send(test);
        }
        case 'PUT': {
            const { questionID } = request.query;
            const { data: question } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/test/${tid}/question/${questionID}`, request.body);
            return response.status(200).send(question);
        }
    }
};

export default withApiAuthRequired(handler);