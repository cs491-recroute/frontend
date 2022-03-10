import React, { Fragment, useCallback } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FlowBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { Flow } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE, STAGE_TYPE } from '../../constants';
import { EuiCollapsibleNav, EuiText } from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import FormPicker from '../../components/FormPicker';
import StageCard from '../../components/StageCard';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
	addStageAsync,
	isLeftPanelOpen as isFlowBuilderLeftPanelOpen, 
	isRightPanelOpen as isFlowBuilderRightPanelOpen,
	toggleLeftPanel as toggleFlowBuilderLeftPanel,
	toggleRightPanel as toggleFlowBuilderRightPanel
} from '../../redux/slices/flowBuilderSlice';

type FlowBuilderProps = {
	flow: Flow;
}

const FlowBuilderPage: NextPage<FlowBuilderProps> = ({ flow }: FlowBuilderProps) => {
	const { name, stages = [] } = flow;
	const dispatch = useAppDispatch();
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
			<FormPicker/>
		</EuiCollapsibleNav>
		<div className={styles.header}>
			{name}
			<SettingsIcon className={styles.settingsIcon}/>
		</div>
		<div className={styles.content}>

			<div 
				className={styles.addFormButton}
				onClick={toggleLeftPanel(true)}
			>
				<EuiText className={styles.text}>
					{translate('Add Start Form')}
				</EuiText>
			</div>
			{stages.length === 0 ? (
				<>nostage</>
			) : (
				<>STAGES</>
			)}
			<StageCard onClick={toggleRightPanel(true)} name="Form"  type={STAGE_TYPE.FORM} />
		</div>
	</Fragment>);
};

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (context) => {
		const { flowID } = context.query;
		try {
			const { data: flow }: AxiosResponse<Flow> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/flow/${flowID}`);
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