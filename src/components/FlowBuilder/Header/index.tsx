import React, { Fragment, useState } from 'react';
import styles from './Header.module.scss';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppSelector } from '../../../utils/hooks';
import { getCurrentFlow } from '../../../redux/slices/flowBuilderSlice';
import {
	EuiButton,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiFormRow,
	EuiDatePicker,
	EuiDatePickerRange,
	EuiFieldText,
	EuiSwitch,
} from '@elastic/eui';
import { translate } from '../../../utils';
import moment from 'moment';
const Header = () => {

	const [isOpen, setOpen] = useState(false);
	const flow = useAppSelector(getCurrentFlow);
	const [specifyDuration, setSpecifyDuration] = useState(flow.startDate !== null);
	const minDate = moment().add(1, 'd');
	const [startDate, setStartDate] = useState(moment(flow.startDate));
	const [endDate, setEndDate] = useState(moment(flow.endDate));
	const [name, setName] = useState(flow.name);
	const isInvalid = startDate > endDate || startDate <= moment();

	const close = () => setOpen(false);
	const open = () => setOpen(true);


	return (<Fragment>
		<div className={styles.header}>
			{name}
			<IconButton onClick={open}>
				<SettingsIcon className={styles.settingsIcon}/>
			</IconButton> 
		</div>
		{isOpen ? (<EuiModal onClose={close} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
			<EuiModalHeader>
				<EuiModalHeaderTitle>{translate('Update Flow Settings')}</EuiModalHeaderTitle>
			</EuiModalHeader>
			<EuiModalBody>
				<EuiFormRow label={translate('Flow Name')} fullWidth>
					<EuiFieldText onChange={({ target: { value }}) => setName(value)} value={name} className='name' fullWidth/>
				</EuiFormRow>
				<EuiFormRow label={translate('Specify Duration')} >
					<EuiSwitch
						label=''
						checked={specifyDuration} 
						onChange={({ target: { checked }}) => setSpecifyDuration(checked)}
					/>
				</EuiFormRow>
				{specifyDuration && <EuiFormRow label={translate('Duration')} fullWidth>
					<EuiDatePickerRange
						fullWidth
						startDateControl={
							<EuiDatePicker
								selected={startDate}
								onChange={date => { if (date) setStartDate(date);}}
								startDate={startDate}
								endDate={endDate}
								minDate={minDate}
								maxDate={endDate}
								isInvalid={isInvalid}
								aria-label="Start date"
								showTimeSelect
								timeFormat='HH:mm'
							/>
						}
						endDateControl={
							<EuiDatePicker
								selected={endDate}
								onChange={date => { if (date) setEndDate(date);}}
								startDate={startDate}
								endDate={endDate}
								minDate={startDate}
								isInvalid={isInvalid}
								aria-label="End date"
								showTimeSelect
								timeFormat='HH:mm'
							/>
						}
					/>
				</EuiFormRow>}
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButton>
                    Save
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>) : (null)};
	</Fragment>

	);	

};

export default Header;