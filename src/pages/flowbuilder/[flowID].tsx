import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
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
import StageCard from '../../components/StageCard';
import SettingsIcon from '@mui/icons-material/Settings';
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
import Condition from '../../components/Condition';

type FlowBuilderProps = {
	flow: Flow;
}

const FlowBuilderPage: NextPage<FlowBuilderProps> = ({ flow }: FlowBuilderProps) => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setCurrentFlow(flow));
	}, []);
	const { name, stages, conditions } = useAppSelector(getCurrentFlow);
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

	const stagesAndConditions = useMemo(() => stages.reduce((acc: JSX.Element[], stage, index, stageArray) => {
		const stageElement = <StageCard 
			type={stage.type} 
			name={stage.stageProps.name} 
			key={stage._id}
			id={stage._id}
		/>;
		const condition = conditions.find(condition => condition.from === stageArray[index]._id && condition.to === stageArray[index + 1]._id);
		const conditionElement = <Condition {...condition} />;
		if (index + 1 === stageArray.length) {
			return [...acc, stageElement];
		}
		return [...acc, stageElement, conditionElement];
	}, []), [stages, conditions]);

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
		<div className={styles.header}>
			{name}
			<SettingsIcon className={styles.settingsIcon}/>
		</div>
		<div className={styles.content}>
			{stagesAndConditions}
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