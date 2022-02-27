import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (request, response) => {
	const { fid } = request.query;

	switch(request.method) {
	case 'GET': {
		// TODO: Get flow whose id is fid
		break;
	}
	case 'UPDATE': {
		// TODO: Update flow whose id is fid
		break;
	}
	case 'DELETE': {
		// TODO: Delete flow whose id is fid
		break;
	}
	}

	response.json({ data: fid });
};

export default withApiAuthRequired(handler);