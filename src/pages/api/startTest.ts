import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';

const checkStageAccess: NextApiHandler = async (request, response) => {
    const { testID, applicantID } = request.body;
    try {
        await gatewayManager.useService(SERVICES.FLOW).post(`/test/${testID}/applicant/${applicantID}/start`);
        return response.status(200).send('OK');
    } catch ({ response: { data: { message }}}: any) {
        return response.status(400).send(message);
    }
};

export default checkStageAccess;