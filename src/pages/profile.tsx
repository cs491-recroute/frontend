import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProfilePage: NextPage = () => {
	const { user } = useUser();

	if (user) {
		return (
			<div>
				<Head>
					<title>My Profile</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
      Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
			</div>
		);
	}
	return null;
};

export default ProfilePage;

export const getServerSideProps = withPageAuthRequired();