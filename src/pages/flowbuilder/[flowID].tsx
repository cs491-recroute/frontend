import React, { Fragment, useCallback } from 'react';
import { NextPage } from 'next';
import styles from '../../styles/FlowBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { Flow } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { getSession, Session, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { getUserID, translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { EuiCollapsibleNav, EuiIcon, EuiText } from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { isFlowBuilderLeftPanelOpen, toggleFlowBuilderLeftPanel } from '../../redux/slices/uiSlice';
import FormPicker from '../../components/FormPicker';

type FlowBuilderProps = {
	flow: Flow;
}

const FlowBuilderPage: NextPage<FlowBuilderProps> = ({ flow }: FlowBuilderProps) => {
	const { name, stages = [] } = flow;
	const dispatch = useAppDispatch();
	const isLeftPanelOpen = useAppSelector(isFlowBuilderLeftPanelOpen);

	const toggleLeftPanel = useCallback(status => () => {
		if (status !== isLeftPanelOpen) dispatch(toggleFlowBuilderLeftPanel(status));
	}, [isLeftPanelOpen]);

	return (<Fragment>
		<EuiCollapsibleNav
			className={styles.leftPanel}
			style={{ top: 120 }}
			isOpen={isLeftPanelOpen}
			onClose={toggleLeftPanel(false)}
			closeButtonPosition="inside"
			ownFocus={false}
		>
			<EuiText className={styles.title}>
				{translate('Form Templates')}
			</EuiText>
			<hr/>
			<FormPicker/>
		</EuiCollapsibleNav>
		<div className={styles.header}>
			{name}
			<EuiIcon type="gear" size="l" className={styles.settingsIcon}/>
		</div>
		<div className={styles.content}>

			{stages.length === 0 ? (
				<div 
					className={styles.addFormButton}
					onClick={toggleLeftPanel(true)}
				>
					<EuiText className={styles.text}>
						{translate('Add Start Form')}
					</EuiText>
				</div>
			) : (
				<>STAGES</>
			)}
		</div>
	</Fragment>);
};

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (context) => {
		const { user } = getSession(context.req, context.res) as Session;
		const { flowID } = context.query;

		try {
			const { data: flow }: AxiosResponse<Flow> = await gatewayManager.useService(SERVICES.FLOW).get(`/flow/${flowID}?userID=${getUserID(user)}`);
			return { props: { flow } as FlowBuilderProps};
		} catch (error) {
			return {
				redirect: {
					permanent: false,
					destination: MAIN_PAGE
				}
			};
		}
	}
});

export default FlowBuilderPage;