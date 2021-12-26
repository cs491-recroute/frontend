/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import styles from '../styles/Profile.module.css';
import { EuiButton } from '@elastic/eui';
import { useRouter } from 'next/router';
import Image from 'next/image';


const ProfilePage: NextPage = () => {
	const { user } = useUser();
	const router = useRouter();
	const handleLogout = () => {
		router.push('/api/auth/logout');
	};

	if (user) {
		return (
			<div className={styles.container}>
				<Head>
					<title>My Profile</title>
				</Head>
				<div className={styles.header}>
					<div className={styles.user}>
						<img src={user.picture || ''} className={styles.avatar}/>
						{user.name}
					</div>
					<div className={styles.title}>My Profile</div>
					<EuiButton
						onClick={handleLogout}
						fill
						color='primary'
					>
						Logout
					</EuiButton>
				</div>
			</div>
		);
	}
	return null;
};

export default ProfilePage;

export const getServerSideProps = withPageAuthRequired();