import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../../../../constants/services';
import { gatewayManager } from '../../../../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const {interviewID, applicantID} = request.query;
    try {
        await gatewayManager.useService(SERVICES.FLOW).post(`/interview/${interviewID}/instance?applicantID=${applicantID}`, request.body);
        response.status(200).send('OK');
    } catch ({ response: { data: { message }}}: any) {
        response.status(400).send(message);
    }

};

export default withApiAuthRequired(handler);