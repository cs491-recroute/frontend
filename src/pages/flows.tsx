import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const FlowsPage: NextPage = () => {
	const { user } = useUser();

	if (user) {
		return (
			<div>
				selam
			</div>
		);
	}
	return null;
};

export default FlowsPage;

export const getServerSideProps = withPageAuthRequired();