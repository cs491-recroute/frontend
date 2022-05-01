import { EuiButton, EuiDatePicker, EuiDatePickerRange, EuiFieldText, EuiFormRow, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiSwitch } from '@elastic/eui';
import moment from 'moment';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { createFlowAsync } from '../../redux/slices/flowsSlice';
import { translate } from '../../utils';
import { useAppDispatch } from '../../utils/hooks';

export type CreateFlowRef = { close: () => void, open: () => void };

const CreateFlowModal = forwardRef<CreateFlowRef>((props, ref) => {
    const dispatch = useAppDispatch();
    // const [specifyDuration, setSpecifyDuration] = useState(false);
    // const minDate = moment().add(1, 'd');
    // const [startDate, setStartDate] = useState(minDate);
    // const [endDate, setEndDate] = useState(moment().add(1, 'month'));
    const [name, setName] = useState('');
    // const isInvalid = startDate > endDate || startDate <= moment();

    const [isOpen, setOpen] = useState(false);

    const close = () => setOpen(false);
    const open = () => setOpen(true);

    useImperativeHandle(ref, () => ({ close, open }));

    const createFlow = () => {
        dispatch(createFlowAsync({
            name
            // ...(specifyDuration && {
            //     startDate: startDate.format(), 
            //     endDate: endDate.format()
            // })
        }));
        setOpen(false);
    };

    return isOpen ? <EuiModal 
        onClose={close} 
        initialFocus='.name' 
        style={{ width: '50vw', height: '50vh', maxWidth: '500px' }} 
        data-testid='create-flow-modal'
    >
        <EuiModalHeader>
            <EuiModalHeaderTitle>{translate('Create New Flow')}</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
            <EuiFormRow label={translate('Flow Name')} fullWidth>
                <EuiFieldText 
                    onChange={({ target: { value }}) => setName(value)} 
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            createFlow()
                            event.preventDefault()
                            event.stopPropagation()
                        }
                    }} 
                    className='name' 
                    fullWidth
                    data-testid='create-flow-modal-name'
                />
            </EuiFormRow>
            {/* <EuiFormRow label={translate('Specify Duration')} >
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
            </EuiFormRow>} */}
        </EuiModalBody>

        <EuiModalFooter>
            <EuiButton onClick={createFlow} fill data-testid='create-flow-modal-button'>
                Create
            </EuiButton>
        </EuiModalFooter>
    </EuiModal> : null;
});
CreateFlowModal.displayName = 'CreateFlowModal';

export default CreateFlowModal;