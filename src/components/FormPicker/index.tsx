import { EuiSelectable } from '@elastic/eui';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';

const FormPicker = () => {
	const [templates, setTemplates] = useState();
	console.log(templates);

	useEffect(() => {
		axios.get('/api/templates/form').then(({ data }) => {
			setTemplates(data);
		});
	}, []);

	return <EuiSelectable
		searchable
	>
		{(list, search) => (
			<Fragment>
				{search}
				{list}
			</Fragment>
		)}

	</EuiSelectable>;
};

export default FormPicker;