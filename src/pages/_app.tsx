import '../styles/globals.css';
import React from 'react';
import '@elastic/eui/dist/eui_theme_light.css';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';

import store from '../app/store';
import { UserProvider } from '@auth0/nextjs-auth0';
import { EuiProvider } from '@elastic/eui';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<Provider store={store}>
				<EuiProvider colorMode='light'>
					<Head>
						<link rel="shortcut icon" href="/images/favicon.ico" />
						<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon.png" />
						<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
						<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
					</Head>
					<Component {...pageProps} />
				</EuiProvider>
			</Provider>
		</UserProvider>
	);
}
