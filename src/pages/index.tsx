import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import styles from '../styles/Home.module.css';

const IndexPage: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Redux Toolkit</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<a href="/api/auth/login">Login</a>
		</div>
	);
};

export default IndexPage;
