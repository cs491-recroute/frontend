import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    try{
        const { data: interviewers } = await gatewayManager.useService(SERVICES.USER).addUser(request, response).get(`/users/interview/interviewers`);
        response.status(200).send(interviewers);
    } catch (error: any) {
        console.log(error.message);
    }
};

export default withApiAuthRequired(handler);