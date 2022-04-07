import React, { Fragment, useEffect, useState } from 'react';
import styles from './Header.module.scss';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { getCurrentFlow, updateActiveStatusAsync, updateFlowAsync, updateFlowTitleAsync } from '../../../redux/slices/flowBuilderSlice';
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
    EuiSwitch
} from '@elastic/eui';
import { translate } from '../../../utils';
import moment from 'moment';
import axios from 'axios';
const Header = () => {
    const dispatch = useAppDispatch();
    const [toggle, setToggle] = useState(true)
    const [isOpen, setOpen] = useState(false);
    const flow = useAppSelector(getCurrentFlow);
    const [specifyDuration, setSpecifyDuration] = useState(flow.startDate != null);
    const minDate = moment().add(1, 'd');
    const [startDate, setStartDate] = useState(moment(flow.startDate));
    const [endDate, setEndDate] = useState(moment(flow.endDate));
    const [name, setName] = useState(flow.name);
    const [isActive, setIsActive] = useState(flow.active);
    const [isInvalid, setIsInvalid] = useState(startDate > endDate || startDate <= moment());

    //specific states for share modal
    const [isShareClicked, setShareClicked] = useState(false);
    let flowURL = '';
    if(flow.stages[0] && typeof window !== 'undefined'){
        flowURL = `${window?.location?.origin}/fill/${flow._id}/${flow.stages[0]._id}`
    }
    const [inviteMail, setInviteMail] = useState('');

    //functions for share modal
    const openShareModal = () => setShareClicked(true);
    const closeShareModal = () => setShareClicked(false);

    const close = () => setOpen(false);
    const open = () => setOpen(true);

    useEffect(() => {
        setSpecifyDuration(flow.startDate != null);
        setStartDate(moment(flow.startDate));
        setEndDate(moment(flow.endDate));
        setName(flow.name);
        setIsActive(flow.active);
        setIsInvalid(startDate > endDate || startDate <= moment());
    }, [flow]);

    const handleTitleField = () => {
        if(flow){
            dispatch(updateFlowTitleAsync({
                name: "name",
                value: name
            }));
        }else{
            alert('Error: Name is not changed')
        } 
    };

    const handleSaveButton = () => {
        if(flow){
            dispatch(updateFlowAsync({
                name: name,
                active: isActive,
                ...(specifyDuration && {startDate: startDate.toString()}),
                ...(specifyDuration && {endDate: endDate.toString()})
    
            }));
        }else{
            alert('Error: Changes could not be saved!')
        }
        setOpen(false);
    };
  
    const handleIsActiveSwitch = (e: { target: { checked: boolean }; }) => {
        if(flow) {
            dispatch(updateActiveStatusAsync({
                name: "active",
                value: e.target.checked
            }));
            setIsActive(e.target.checked);
        }else{
            alert('Error: Status of the flow could not be updated');
        }

    };

    const handleSendInvite = async () => {
        if(inviteMail){
            try {
                const res = await axios.post(`/api/flows/${flow._id}/inviteMail`, {
                    mail: inviteMail
                });
            } catch ({ response: { data }}: any) {
                const res = data as string;
            }
        }else{
            alert('You should enter an email address');
        }
    };

    return (<Fragment>
        <div className={styles.header}>
            {toggle ? (<p onDoubleClick={() => {setToggle(false)}}>{name}</p>) : (<input className={styles.input} type='text' value={name}
                onChange={event => {setName(event.target.value)}}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        handleTitleField()
                        setToggle(true)
                        event.preventDefault()
                        event.stopPropagation()
                    }
                }}
            />)}
            <IconButton onClick={open}>
                <SettingsIcon className={styles.settingsIcon}/>
            </IconButton>
            <div className={styles.rightButtons}>
                <EuiSwitch
                    label={isActive ? 'Active' : 'Inactive'}
                    checked={isActive}
                    onChange={handleIsActiveSwitch}                
                />
                <EuiButton
                    style={{marginLeft: '10px'}}
                    iconType={'share'}
                    color={'primary'}
                    isDisabled={!isActive}
                    onClick={openShareModal}
                >
                    Share
                </EuiButton>
            </div>

        </div>
        {isOpen && (<EuiModal onClose={close} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>{translate('Update Flow Settings')}</EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
                <EuiFormRow label={translate('Flow Name')} fullWidth>
                    <EuiFieldText onChange={({ target: { value }}) => setName(value)} value={name} className='name'
                        fullWidth
                    />
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
                <EuiFormRow label={translate('Active')} >
                    <EuiSwitch
                        label=''
                        checked={isActive}
                        disabled={specifyDuration}
                        onChange={({ target: { checked }}) => setIsActive(checked)}
                    />
                </EuiFormRow>
            </EuiModalBody>

            <EuiModalFooter>
                <EuiButton onClick={handleSaveButton}>
                    Save
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>)}
        {isShareClicked && (<EuiModal onClose={closeShareModal} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>{translate('Share Flow')}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <EuiFormRow label={translate('LINK TO SHARE')} fullWidth>
                    <EuiFieldText icon={'link'} value={flowURL}
                        placeholder="Placeholder text" 
                        disabled={true}
                        fullWidth
                    />
                </EuiFormRow>
                <div className={styles.shareLinkButtons}>                        
                    <EuiFormRow>
                        <EuiButton onClick={() => {navigator.clipboard.writeText(flowURL);}} fill>
                        Copy Link
                        </EuiButton>
                    </EuiFormRow>

                    <EuiFormRow>
                        <EuiButton onClick={() => window.open(flowURL, '_blank')} fill>
                            {translate('Open in New Tab')}
                        </EuiButton>
                    </EuiFormRow>
                </div>

                <EuiFormRow label={translate('INVITE BY EMAIL')}  fullWidth>
                    <EuiFieldText icon={'email'} value={inviteMail}
                        placeholder="info@recroute.com"
                        fullWidth
                        onChange={event => {setInviteMail(event.target.value)}}
                    />
                </EuiFormRow>
                <EuiFormRow fullWidth>  
                    <EuiButton onClick={handleSendInvite} style={{float: 'right'}} fill>
                        Send Invite
                    </EuiButton>
                </EuiFormRow>
            </EuiModalBody>
        </EuiModal>)};
    </Fragment>

    );	

};

export default Header;
