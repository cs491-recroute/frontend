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
import { EuiCollapsibleNav, EuiIcon, EuiText } from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { isFlowBuilderLeftPanelOpen, toggleFlowBuilderLeftPanel } from '../../redux/slices/uiSlice';
import FormPicker from '../../components/FormPicker';
import StageCard from '../../components/StageCard';

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
			<StageCard name="Form" description='Applicants need to fill that form.' type={STAGE_TYPE.FORM} />
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