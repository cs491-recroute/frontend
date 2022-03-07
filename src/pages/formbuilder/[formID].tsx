import React, { Fragment, useCallback } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FormBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { Form } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { EuiButton, EuiCollapsibleNav, EuiIcon, EuiSelectable, EuiSelectableOption, EuiText } from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { 
	isLeftPanelOpen as isFormBuilderLeftPanelOpen,
	toggleLeftPanel as toggleFormBuilderLeftPanel,
} from '../../redux/slices/formBuilderSlice';

type FormBuilderProps = {
	form: Form;
}

type FormOption = EuiSelectableOption;

const options : FormOption[] = [{label: 'Full Name'}, {label: 'Header'}, {label: 'Email'}, {label: 'Address'}, {label: 'Phone number'},];

const FormBuilderPage: NextPage<FormBuilderProps> = ({ form }: FormBuilderProps) => {
	const { name } = form;
	const dispatch = useAppDispatch();
	const isLeftPanelOpen = useAppSelector(isFormBuilderLeftPanelOpen);

	const toggleLeftPanel = useCallback(status => () => {
		if (status !== isLeftPanelOpen) dispatch(toggleFormBuilderLeftPanel(status));
	}, [isLeftPanelOpen]);


	return (<Fragment>
		<div className={styles.header}>
			{name}
			<EuiIcon type="gear" size="l" className={styles.settingsIcon}/>
		</div>
		<EuiCollapsibleNav
			className={styles.leftPanel}
			style={{ top: 120 }}
			isOpen={isLeftPanelOpen}
			onClose={toggleLeftPanel(false)}
			closeButtonPosition="inside"
			ownFocus={false}
			button={
				<EuiButton onClick={toggleLeftPanel(true)} iconType='plusInCircle'>
                  Create New Form
				</EuiButton>
			}
		>
			<EuiText className={styles.title}>
				{translate('Form Elements')}
			</EuiText>
			<hr/>
			<EuiSelectable
				searchable
				options={options}
			>
				{(list, search) => (
					<Fragment>
						{search}
						{list}
					</Fragment>
				)}

			</EuiSelectable>	
		</EuiCollapsibleNav>
		<div className={styles.content}>
			<div 
				className={styles.createFormButton}
				onClick={toggleLeftPanel(true)}
			>
				<EuiText className={styles.text}>
					{translate('Create New Form')}
				</EuiText>
			</div>	
		</div>
	</Fragment>);
};


export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (context) => {
		const { formID } = context.query;
		try {
			const { data: form }: AxiosResponse<Form> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/form/${formID}`);
			return { props: { form } as FormBuilderProps};
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

export default FormBuilderPage;