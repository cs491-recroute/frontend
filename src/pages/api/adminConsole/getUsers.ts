import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const handler: NextApiHandler = async (request, response) => {
    const { limitFromUser, pageFromUser } = request.body;
    try{
        const { data: users } = await gatewayManager.useService(SERVICES.USER).addUser(request, response).get(`/users`, {params: {limit: limitFromUser, page: pageFromUser}});
        response.status(200).send(users);
    } catch ({ response: { data: { message }}}: any) {
        return response.status(400).send(message);
    }
};

export default withApiAuthRequired(handler);