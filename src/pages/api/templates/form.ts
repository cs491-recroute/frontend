import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';
import { Form } from '../../../types/models';

const getFormTemplates: NextApiHandler = async (request, response) => {
    try {
        const { data: formTemplates } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get('/templates/form');
        response.json(formTemplates as Form[]);
    } catch (error) {
        response.json([] as Form[]);
    }
};

export default withApiAuthRequired(getFormTemplates);