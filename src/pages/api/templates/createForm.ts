import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const createFormTemplate: NextApiHandler = async (request, response) => {
    try {
        const { data: { formID } } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post('/templates/form');
        response.status(200).send(formID);
    } catch (error: any) {
        response.status(400).send(`Error creating form! ${error.message}`);
    }
};

export default withApiAuthRequired(createFormTemplate);