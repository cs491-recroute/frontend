/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getUser, updateUserAsync, updateTimeSlotsAsync } from '../redux/slices/userSlice';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../styles/Profile.module.scss';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { AxiosResponse } from 'axios';
import { MAIN_PAGE } from '../constants';
import { SERVICES } from '../constants/services';
import { setCurrentUser } from '../redux/slices/userSlice';
import { wrapper } from '../redux/store';
import { User, TimeSlot } from '../types/models';
import { gatewayManager } from '../utils/gatewayManager';
import { EuiButton, EuiButtonEmpty, EuiDatePicker, EuiFieldText, EuiFormRow, EuiIcon, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiOverlayMask } from '@elastic/eui';
import { translate } from '../utils';
import moment, { Moment } from 'moment';
import { Paper } from '@mui/material';

const ProfilePage: NextPage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    /*let str;
    if(user.profileImage){
        str = Buffer.from(user.profileImage).toString('base64')
    }*/

    const [editable, setEditable] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [timeSlots, setTimeSlots] = useState(user.availableTimes);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    // This is an inline component because it uses page state
    const Popup = (props: any) => {
        // for popup screen
        const [startDate, setStartDate] = useState(moment());
        const [duration, setDuration] = useState(30);

        const addTimeSlot = () => {
            const newTimeSlot: TimeSlot = {
                startTime: startDate?.toDate().toString(),
                durationInMins: duration
            }

            let included = false;
            const newTimeSlots = [...timeSlots];
            for(let i = 0; i < newTimeSlots.length; i++){
                if(newTimeSlot.startTime === newTimeSlots[i].startTime){
                    included = true;
                    break;
                }
            }
            if(!included){
                newTimeSlots.push(newTimeSlot);
                setTimeSlots(newTimeSlots);
            } // else timeslot is already included
            props.handleClose();
        };

        const handleDateChange = (date: Moment) => {
            setStartDate(date);
        };

        /*
        const handleDurationChange = ({ target: { value } }: any) => {
            if(!isNaN(value)){
                setDuration(parseInt(value));
            }
        }*/

        return (
            <EuiOverlayMask>
                <EuiModal onClose={togglePopup}>
                    <EuiModalHeader>
                        <EuiModalHeaderTitle>Add a Time Slot</EuiModalHeaderTitle>
                    </EuiModalHeader>

                    <EuiModalBody>
                        {<div>
                            <EuiFormRow label='Fixed Duration in Minutes'>
                                <p
                                    id='popupDuration'
                                >{duration}</p>
                            </EuiFormRow>
                            <EuiFormRow label='Select Start Date'>
                                <EuiDatePicker
                                    id='popupStartDate'
                                    showTimeSelect
                                    selected={startDate}
                                    placeholder='Select Date and Hour'
                                    onChange={handleDateChange}
                                    minDate={moment()}
                                    timeFormat='HH:mm'
                                    dateFormat='D MMMM YYYY HH:mm'
                                />
                            </EuiFormRow>
                        </div>}
                    </EuiModalBody>

                    <EuiModalFooter>
                        <EuiButtonEmpty onClick={() => togglePopup()}>Cancel</EuiButtonEmpty>

                        <EuiButton onClick={addTimeSlot} fill>
                            Add Time Slot
                        </EuiButton>
                    </EuiModalFooter>
                </EuiModal>
            </EuiOverlayMask>
        );
    };

    const handleSave = () => {
        const newProps = {
            name: 'name',
            value: newName
        }
        dispatch(updateUserAsync(newProps));
        const newTimeSlots = [...timeSlots]
        dispatch(updateTimeSlotsAsync(newTimeSlots));
        setEditable(false);
    }

    const deleteTimeslot = (startTimeDel: string, durationDel: number) => {
        for (let i = 0; i < timeSlots.length; i++) {
            if (durationDel === timeSlots[i].durationInMins && startTimeDel === timeSlots[i].startTime) {
                const temp = [...timeSlots];
                temp.splice(i, 1);
                setTimeSlots(temp);
                break;
            }
        }
    }

    if (user) {
        return (
            <div className={styles.container}>
                <Paper className={styles.card} elevation={4}>
                    <h1 className={styles.title1}>{translate('User Settings')}</h1>
                    <hr />
                    <table>
                        <tbody>
                            <tr className={styles.tr}>
                                <td>
                                    <h1 className={styles.title2}>{translate('User Name :')}</h1>
                                </td>
                                <td>
                                    {editable ? <EuiFieldText
                                        className={styles.p}
                                        value={newName}
                                        onChange={event => setNewName(event.target.value)}
                                    >
                                    </EuiFieldText>
                                        : <p className={styles.p}>{user.name}</p>
                                    }
                                </td>
                            </tr>
                            <tr className={styles.tr}>
                                <td>
                                    <h1 className={styles.title2}>{translate('Email :')}</h1>
                                </td>
                                <td>
                                    <p className={styles.p}>{user.email}</p>
                                </td>
                            </tr>
                            <tr className={styles.tr}>
                                <td>
                                    <h1 className={styles.title2}>{translate('Company :')}</h1>
                                </td>
                                <td>
                                    <p className={styles.p}>{user.company.name}</p>
                                </td>
                            </tr>
                            <tr className={styles.tr}>
                                <td>
                                    <h1 className={styles.title2}>{translate('User Roles :')}</h1>
                                </td>
                                <td>
                                    {user.roles.length === 0 ? <p className={styles.p}>{translate('No Roles Assigned')}</p>
                                        : user.roles.map((role: string) => (
                                            <p key={role} className={styles.p}>{role}</p>
                                        ))}
                                </td>
                            </tr>
                            <tr className={styles.tr}>
                                <td>
                                    <h1 className={styles.title2}>{translate('User\'s Available Times :')}</h1>
                                    {editable ? <button onClick={togglePopup} className={styles.addButton}>Add Time Slot</button> : null}
                                </td>
                                <td>
                                    {timeSlots.length === 0 ? <p className={styles.p}>{translate('No Available Time Specified')}</p>
                                        : <div className={styles.tableFixHead}>
                                            <table className={styles.timeSlotTable}>
                                                <tbody>
                                                    <tr>
                                                        <th>{translate('Start Date')}</th>
                                                        <th>{translate(`Start Time (${Intl.DateTimeFormat().resolvedOptions().timeZone})`)}</th>
                                                        <th>{translate('Duration in Minutes')}</th>
                                                        {editable ? <th></th> : null}
                                                    </tr>
                                                    {timeSlots.map((availableTime: TimeSlot, index: number) => (
                                                        <tr className={styles.timeSlotTableRow}
                                                            key={index}
                                                        >
                                                            <td className={styles.tdata}>
                                                                <p className={styles.tcol1}>{moment(availableTime.startTime).format('D MMMM YYYY')}
                                                                </p>
                                                            </td>
                                                            <td className={styles.tdata}>
                                                                <p className={styles.tcol1}>{moment(availableTime.startTime).format('HH:mm')}
                                                                </p>
                                                            </td>
                                                            <td className={styles.tdata}>
                                                                <p className={styles.tcol1}>{availableTime.durationInMins}</p>
                                                            </td>
                                                            {editable ? <td>
                                                                <button
                                                                    className={styles.deleteButton}
                                                                    onClick={() => deleteTimeslot(availableTime.startTime, availableTime.durationInMins)}
                                                                >
                                                                    ✖
                                                                </button>
                                                            </td> : null}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </td>
                            </tr>
                            {isOpen && <Popup
                                handleClose={togglePopup}
                            />}
                        </tbody>
                    </table>

                </Paper>
                <EuiButton
                    className={styles.button}
                    onClick={editable ? () => handleSave() : () => setEditable(true)}
                >
                    {editable ? translate('Save') : translate('Edit')}
                </EuiButton>
            </div>
        )
    }
    return null;

};

export default ProfilePage;

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        try {
            const { data: user }: AxiosResponse<User> = await gatewayManager.useService(SERVICES.USER).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/user`);
            dispatch(setCurrentUser(user));
            return { props: {} };
        } catch (error) {
            return {
                redirect: {
                    permanent: false,
                    destination: MAIN_PAGE
                }
            };
        }
    })
});