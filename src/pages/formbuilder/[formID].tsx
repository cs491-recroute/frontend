import React, { Fragment, useCallback, useState } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FormBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { Form } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { EuiButton, EuiCollapsibleNav, EuiIcon, EuiSelectable, EuiSelectableOption, EuiCard, EuiText, EuiFieldText, EuiFormRow, EuiForm} from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { 
	isLeftPanelOpen as isFormBuilderLeftPanelOpen,
	toggleLeftPanel as toggleFormBuilderLeftPanel,
} from '../../redux/slices/formBuilderSlice';

type FormBuilderProps = {
	form: Form;
}

type FormOption = EuiSelectableOption;

const Options : FormOption[] = [
	{label: 'Full Name'}, 
	{label: 'Header'},
	{label: 'Email'},
	{label: 'Address'},
	{label: 'Phone number'}
];


const FormBuilderPage: NextPage<FormBuilderProps> = ({ form }: FormBuilderProps) => {
	const [options, setOptions] = useState(Options);

	const { name } = form;
	const dispatch = useAppDispatch();
	const isLeftPanelOpen = useAppSelector(isFormBuilderLeftPanelOpen);

	const toggleLeftPanel = useCallback(status => () => {
		if (status !== isLeftPanelOpen) dispatch(toggleFormBuilderLeftPanel(status));
	}, [isLeftPanelOpen]);

	type FormElementProps = {
		labelName: string
	}

	function FormElement(props:FormElementProps){
		return(
			<EuiFormRow label={props.labelName} >
				<EuiFieldText/>
			</EuiFormRow>
		);
	}

	function createFormElement(option:EuiSelectableOption){
		if(option.checked === 'on') {
			return <FormElement labelName={option.label}/>;
		}
	}

	function FormCard(){
		console.log(options);
		return( 
			<EuiCard 
				className={styles.card}
				title="Form Title"
			>
				<EuiForm>
					{options.map(createFormElement)}
				</EuiForm>
				<EuiButton className={styles.returnToFlow} onClick={toggleLeftPanel(true)}>
					Return to Flow
				</EuiButton>
			</EuiCard>
		);
	}
	
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
				onChange={newOptions => setOptions(newOptions)}
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
			<div>
				<FormCard />
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