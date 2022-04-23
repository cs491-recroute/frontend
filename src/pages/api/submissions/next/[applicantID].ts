import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { applicantID } = request.query;
    try {
        const { data: result } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/applicant/${applicantID}/next`);
        response.status(200).send(result);
    } catch (error: any) {
        response.status(400).send(error.response.data.message);
    }
};

export default withApiAuthRequired(handler);