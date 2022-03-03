import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../utils/gatewayManager';
import { SERVICES } from '../../../constants/services';

const getFormTemplates: NextApiHandler = async (request, response) => {
	try {
		const { data: formTemplates } = await gatewayManager.useService(SERVICES.FLOW).addUser(request, response).get('/templates/form');
		response.json(formTemplates);
	} catch (error) {
		response.json([]);
	}
};

export default withApiAuthRequired(getFormTemplates);