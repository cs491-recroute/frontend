/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiFormRow, EuiButton, EuiDatePicker, EuiText } from '@elastic/eui';
import { translate } from '../../../../utils';
import moment, { Moment } from 'moment';

type fetchedTimeSlot = {
    durationInMins: number,
    interviewerID: string,
    meetingID: string,
    scheduled: boolean,
    startTime: string,
    _id: string
};

const ScheduleInterviewPage: NextPage = () => {
    const router = useRouter();
    const {applicantID, interviewID} = router.query;
    const [selectedDate, setSelectedDate] = useState(moment().add(1, 'days'));
    const [fetchedTimeSlots, setFetchedTimeSlots] = useState([] as fetchedTimeSlot[]);
    const [times, setTimes] = useState([] as Moment[])
    const [interviewDates, setInterviewDates] = useState([] as Moment[]);

    useEffect(() => {
        async function getInterviewers() {
            try {
                const { data } = await axios.get(`/api/interviews/${interviewID}`);
                const fetchedInterviewers = data.interview.interviewers;
                const {data: timeSlots} = await axios.post('/api/user/timeSlots', {
                    fetchedInterviewers
                });
                setFetchedTimeSlots(timeSlots);
                if(timeSlots.length === 0){
                    alert('There is no available time slot. Please contact with company.')
                }else {
                    const fetchedInterviewDates = timeSlots.map((e: any) => moment(e.startTime));
                    setInterviewDates(fetchedInterviewDates);
                    setSelectedDate(fetchedInterviewDates[0]);
                    const newTimes = fetchedInterviewDates.filter((e: any) => {
                        return fetchedInterviewDates[0].clone().startOf('day').toString() === e.clone().startOf('day').toString();
                    });
                    setTimes(newTimes);
                }
            } catch (error: any) {
                console.log(error);
            }
        }
        if(!router.isReady) return;
        getInterviewers();

    }, [interviewID]);

    const handleChange = (date: Moment) => {
        const selectedTime = interviewDates.find(e => date.clone().startOf('day').toString() === e.clone().startOf('day').toString());
        if(!selectedTime) return;
        setSelectedDate(selectedTime);
        const newTimes = interviewDates.filter(e => {
            return date.clone().startOf('day').toString() === e.clone().startOf('day').toString();
        });
        setTimes(newTimes);
    };

    const handleSaveButton = async() => {
        const selectedSlot = fetchedTimeSlots.find(({startTime}) => moment(startTime).isSame(selectedDate));
        if(selectedSlot){
            const body = {interviewerID: selectedSlot.interviewerID, timeSlotID: selectedSlot._id};
            try {
                await axios.post(`/api/modal/interview/timeSlot/${applicantID}/${interviewID}/scheduleInterview`, body);
            } catch ({ response: { data }}: any) {
                console.log(data);
            }
        }

    };

    if (applicantID) {
        return (
            <EuiModal onClose={() => {}} initialFocus='.name' style={{ width: '50vw', height: '60vh', maxWidth: '500px' }}>
                <EuiModalHeader>
                    <EuiModalHeaderTitle>{translate('Schedule Interview')}</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>
                    <EuiFormRow>
                        <EuiText style={{fontStyle: 'italic', fontWeight: 'bold'}}>{translate('Please select the interview date from the available time slots.')}</EuiText>
                    </EuiFormRow>

                    <EuiFormRow label="Exclude yesterday and today">
                        <EuiDatePicker
                            showTimeSelect
                            selected={selectedDate}
                            onChange={handleChange}
                            includeDates={interviewDates}
                            includeTimes={times}
                        />
                    </EuiFormRow>
                </EuiModalBody>

                <EuiModalFooter>
                    <EuiButton onClick={handleSaveButton} disabled={fetchedTimeSlots.length === 0} fill >
                        {translate('Save')}
                    </EuiButton>

                </EuiModalFooter>
            </EuiModal>
        )
    }
    return null;
};

export default ScheduleInterviewPage;