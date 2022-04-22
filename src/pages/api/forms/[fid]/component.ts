import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../constants/services';
import { gatewayManager } from '../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    try{
        const { fid } = request.query;
        const { data: form } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).post(`/form/${fid}/component`, request.body);
        response.status(200).send(form);
    } catch (error: any) {
        console.log(error.message);
        console.log(error.response.data.message);
    }
};

export default withApiAuthRequired(handler);