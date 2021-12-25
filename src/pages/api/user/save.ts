import type { NextApiHandler } from 'next';
import prisma from '../../../../prisma';

const saveUser: NextApiHandler = async (request, response) => {
	console.log(request.body);
	const { email } = request.body;

	console.log(email);
	const result = await prisma.user.create({
		data: {
			email,
		},
	});
	response.json(result);
};

export default saveUser;