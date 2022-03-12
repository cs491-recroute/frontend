import React, { Fragment, useCallback } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FlowBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { Flow } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { EuiCollapsibleNav, EuiText } from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import FormPicker from '../../components/FormPicker';
import { 
	addStageAsync,
	getCurrentFlow,
	isLeftPanelOpen as isFlowBuilderLeftPanelOpen, 
	isRightPanelOpen as isFlowBuilderRightPanelOpen,
	setCurrentFlow,
	toggleLeftPanel as toggleFlowBuilderLeftPanel,
	toggleRightPanel as toggleFlowBuilderRightPanel
} from '../../redux/slices/flowBuilderSlice';
import { STAGE_TYPE } from '../../types/enums';
import Main from '../../components/FlowBuilder/Main';
import Header from '../../components/FlowBuilder/Header';
import { wrapper } from '../../redux/store';

const FlowBuilderPage: NextPage = () => {
	const dispatch = useAppDispatch();
	const { stages, conditions } = useAppSelector(getCurrentFlow);
	const isLeftPanelOpen = useAppSelector(isFlowBuilderLeftPanelOpen);
	const isRightPanelOpen = useAppSelector(isFlowBuilderRightPanelOpen);

	const toggleLeftPanel = useCallback(status => () => {
		if (status !== isLeftPanelOpen) dispatch(toggleFlowBuilderLeftPanel(status));
	}, [isLeftPanelOpen]);

	const toggleRightPanel = useCallback(status => () => {
		if (status !== isRightPanelOpen) dispatch(toggleFlowBuilderRightPanel(status));
	}, [isRightPanelOpen]);

	const handleFormSelect = useCallback(formID => {
		dispatch(addStageAsync({ 
			type: STAGE_TYPE.FORM, 
			stageID: formID 
		}));
	}, []);

	return (<Fragment>
		<EuiCollapsibleNav
			className={styles.leftPanel}
			isOpen={isLeftPanelOpen}
			onClose={toggleLeftPanel(false)}
			closeButtonPosition="inside"
			ownFocus={false}
		>
			<EuiText className={styles.title}>
				{translate('Form Templates')}
			</EuiText>
			<hr/>
			<FormPicker returnBack onSelect={handleFormSelect}/>
		</EuiCollapsibleNav>
		<EuiCollapsibleNav
			className={styles.rightPanel}
			style={{ top: 120 }}
			isOpen={isRightPanelOpen}
			onClose={toggleRightPanel(false)}
			closeButtonPosition="inside"
			ownFocus={false}
			side='right'
		>
			<EuiText className={styles.title}>
				{translate('Settings')}
			</EuiText>
			<hr/>
		</EuiCollapsibleNav>
		<Header/>
		<Main 
			conditions={conditions} 
			stages={stages}
			className={styles.content}
		/>
	</Fragment>);
};

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async (context) => {
		const { flowID } = context.query;
		try {
			const { data: flow }: AxiosResponse<Flow> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/flow/${flowID}`);
			dispatch(setCurrentFlow(flow));
			return { props: {}};
		} catch (error) {
			return {
				redirect: {
					permanent: false,
					destination: MAIN_PAGE
				}
			};
		}
	})
});

export default FlowBuilderPage;