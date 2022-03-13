import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const createTestTemplate: NextApiHandler = async (request, response) => {
    try {
        const { data: { testID } } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post('/templates/test');
        response.status(200).send(testID);
    } catch (error: any) {
        response.status(400).send(`Error creating form! ${error.message}`);
    }
};

export default withApiAuthRequired(createTestTemplate);