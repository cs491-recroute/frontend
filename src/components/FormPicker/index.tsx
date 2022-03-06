import { EuiButton, EuiSelectable, EuiSelectableOption } from '@elastic/eui';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from '../../types/models';
import { translate } from '../../utils';
import styles from './FormPicker.module.scss';
import VisibilityIcon from '@mui/icons-material/Visibility';

type FormOption = EuiSelectableOption<{ name: string; formID: string; }>;

type FormPickerOptions = {
	returnBack?: boolean;
}

const FormPicker = ({ returnBack = false }: FormPickerOptions) => {
	const [templates, setTemplates] = useState([] as Form[]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		axios.get('/api/templates/form').then(({ data }) => {
			setTemplates(data as Form[]);
		}).finally(() => setLoading(false));
	}, []);

	const handleTemplateSelect = useCallback((options: FormOption[]) => {
		const selectedForm = options.find(option => option.checked === 'on');
		// TODO: Create stage with form
		console.log('create stage with template form', selectedForm?.formID);
	}, []);

	const goToFlowBuilder = useCallback(formID => {
		const url = `/formbuilder/${formID}`;
		const query = `${returnBack ? `?returnTo=${router.asPath}` : ''}`;
		router.push(url + query, url);
	}, [router]);

	const handleCreateForm = useCallback(() => {
		axios.post('/api/templates/createForm').then(({ data: formID }) => {
			goToFlowBuilder(formID);
		});
	}, []);

	const handlePreviewForm = useCallback(formID => () => {
		goToFlowBuilder(formID);
	}, []);

	const options = useMemo(() => templates.map<FormOption>(({ _id, name }) => ({
		label: _id,
		name,
		formID: _id,
		append: <VisibilityIcon onClick={handlePreviewForm(_id)}/>
	})), [templates]);

	return <div className={styles.container}>
		<EuiSelectable
			isLoading={loading}
			searchable
			singleSelection
			className={styles.list}
			height="full"
			listProps={{ paddingSize: 'none', rowHeight: 50, onFocusBadge: false } as any}
			options={options}
			renderOption={({ name }) => <div>{name}</div>}
			onChange={handleTemplateSelect}
		>
			{(list, search) => (
				<Fragment>
					{search}
					{list}
				</Fragment>
			)}

		</EuiSelectable>
		<EuiButton
			color='text'
			fullWidth
			onClick={handleCreateForm}
		>
			{translate('Create New Form Template')}
		</EuiButton>
	</div>;
};

export default FormPicker;