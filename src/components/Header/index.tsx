import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useUserInfo } from '../../utils/hooks';
import styles from './Header.module.scss';
import Image from 'next/image';
import { EuiContextMenu, EuiPopover, EuiText, useGeneratedHtmlId } from '@elastic/eui';

const Header = () => {
	const { user } = useUserInfo();
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

	const avatar = (<img onClick={onAvatarClick} className={styles.avatar} src={user.picture || ''} height={30} width={30}/>);
	return <div id='mainHeader' className={styles.container}>
		<Image src='/assets/white_logo.svg' height={40} width={40}/>
		<EuiText className={styles.companyText}>Recroute</EuiText>
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
