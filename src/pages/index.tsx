import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import styles from '../styles/Home.module.scss';
import Head from 'next/head';
import Image from 'next/image';
import { EuiButton } from '@elastic/eui';
import { useRouter } from 'next/router';

const mainPage = '/flows';

const IndexPage: NextPage = () => {
	const router = useRouter();
	const handleLogin = () => {
		router.push(`/api/auth/login?returnTo=${mainPage}`);
	};
	return <div className={styles.container}>				
		<Head>
			<title>Recroute</title>
		</Head>
		<div className={styles.header}>
			<div className={styles.logo}>
				<Image src='/assets/logo_black.png' width='50' height='50'/>
				<div className={styles.name}>
					<Image src='/assets/name.svg' width='210' height='40'/>
				</div>
			</div>
			<EuiButton 
				onClick={handleLogin}
				fill
				color='primary'
			>
				Login
			</EuiButton>
		</div>
		<div className={styles.content}>
			<div className={styles.description}>
				<Image src='/assets/name.svg' width='315' height='80'/>
				<div className={styles.banner}>Recruiting platform for all your needs</div>
			</div>
			<div className={styles.illustration}>
				<Image layout='fill' src='/assets/landing_illustration.jpg' objectFit='contain'/>
			</div>
		</div>
	</div>;
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
	const session = getSession(req, res);

	if (session) {		
		return {
			redirect: {
				permanent: false,
				destination: mainPage
			}
		};
	}
	return {
		props: {}
	};
};