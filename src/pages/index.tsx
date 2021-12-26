import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';

const IndexPage: NextPage = () => {
	return <a href="/api/auth/login?returnTo=/profile">Login</a>;
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
	const session = getSession(req, res);

	if (session) {		
		return {
			redirect: {
				permanent: false,
				destination: '/profile'
			}
		};
	}
	return {
		props: {}
	};
};