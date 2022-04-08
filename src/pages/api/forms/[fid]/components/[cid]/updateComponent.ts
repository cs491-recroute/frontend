import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../../../../constants/services';
import { gatewayManager } from '../../../../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { fid, cid } = request.query;
    try {
        const { data: component } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).put(`/form/${fid}/component/${cid}/all`, request.body);
        return response.status(200).send(component);
    }
    catch(error : any){
        console.log(error.message);
    }
};

export default withApiAuthRequired(handler);