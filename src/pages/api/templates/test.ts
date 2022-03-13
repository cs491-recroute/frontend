import { Test } from './../../../types/models';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const getTestTemplates: NextApiHandler = async (request, response) => {
    try {
        const { data: testTemplates } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get('/templates/test');
        response.json(testTemplates as Test[]);
    } catch (error) {
        response.json([] as Test[]);
    }
};

export default withApiAuthRequired(getTestTemplates);