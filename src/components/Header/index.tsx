import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import { EuiContextMenu, EuiPopover, EuiText, useGeneratedHtmlId } from '@elastic/eui';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

const Header = () => {
	const { user } = useUser();
	const router = useRouter();
	const [isUserMenuOpen, toggleUserMenu] = useState(false);

	const contextMenuPopoverId = useGeneratedHtmlId({
		prefix: 'contextMenuPopover',
	});
	const onAvatarClick = () => toggleUserMenu(open => !open);
	const closeMenu = () => toggleUserMenu(false);

	if (!user) {
		return null;
	}

	// eslint-disable-next-line @next/next/no-img-element
	const avatar = (<img onClick={onAvatarClick} className={styles.avatar} src={user.picture || ''} height={30} width={30}/>);
	return <div id='mainHeader' className={styles.container}>
		<Link href='/'>
			<a className={styles.homeLink}>
				<Image src='/assets/white_logo.svg' height={40} width={40}/>
				<EuiText className={styles.companyText}>Recroute</EuiText>
			</a>
		</Link>
		<div style={{ flex: 1 }}/>
		<EuiPopover
			id={contextMenuPopoverId}
			button={avatar}
			isOpen={isUserMenuOpen}
			closePopover={closeMenu}
			panelPaddingSize="none"
			anchorPosition='downLeft'
		>
			<EuiContextMenu 
				initialPanelId={0} 
				panels={[
					{
						id: 0,
						title: `Hello ${user?.nickname || ''}`,
						items: [
							{
								name: 'Admin Console',
								icon: 'indexSettings',
								onClick: () => router.push('/admin')
							},
							{
								name: 'Settings',
								icon: 'gear',
								onClick: () => router.push('/profile')
							},
							{
								name: 'Logout',
								icon: 'exit',
								onClick: () => router.push('/api/auth/logout')
							}
						]
					}
				]} size="s"/>
		</EuiPopover>
	</div>;
};

export default Header;
