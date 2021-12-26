import '../styles/globals.css';
import React from 'react';
import '@elastic/eui/dist/eui_theme_light.css';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';

import store from '../app/store';
import { UserProvider } from '@auth0/nextjs-auth0';
import { EuiProvider } from '@elastic/eui';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<Provider store={store}>
				<EuiProvider colorMode='light'>
					<Component {...pageProps} />
				</EuiProvider>
			</Provider>
		</UserProvider>
	);
}
