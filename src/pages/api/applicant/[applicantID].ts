import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { applicantID } = request.query;
    try {
        const { data: applicant } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get(`/applicant/${applicantID}`);
        response.status(200).send(applicant);
    } catch (error: any) {
        response.status(400).send(error.message);
    }
};

export default withApiAuthRequired(handler);