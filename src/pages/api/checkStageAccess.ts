import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';

const checkStageAccess: NextApiHandler = async (request, response) => {
    const { flowID, stageID, userIdentifier, withEmail } = request.body;
    try {
        await gatewayManager.useService(SERVICES.FLOW).get(`/${flowID}/${stageID}/${userIdentifier}/access`, { params: { withEmail } });
        return response.status(200).send('OK');
    } catch ({ response: { data: { message }}}: any) {
        return response.status(400).send(message);
    }
};

export default checkStageAccess;