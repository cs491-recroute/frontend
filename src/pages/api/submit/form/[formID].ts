import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../../utils/gatewayManager';
import { SERVICES } from '../../../../constants/services';

const submitForm: NextApiHandler = async (request, response) => {
    const { formID, userIdentifier, withEmail } = request.query;
    try {
        await gatewayManager.useService(SERVICES.FLOW).post(`/form/${formID}/submission/${userIdentifier}`, { componentSubmissions: request.body }, { params: { withEmail } });
        response.status(200).send('OK');
    } catch ({ response: { data: { message }}}: any) {
        response.status(400).send(message);
    }
};

export default submitForm;