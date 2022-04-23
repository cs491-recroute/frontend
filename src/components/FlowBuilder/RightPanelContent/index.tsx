import React, { useCallback, useEffect, useState } from 'react';
import styles from './RightPanelContent.module.scss';
import { Interviewer, Stage } from '../../../types/models';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { getCurrentFlow, updateInterviewAsync, updateStageAsync } from '../../../redux/slices/flowBuilderSlice';
import { EuiButton, EuiDatePicker, EuiFormRow, EuiSpacer, EuiSwitch, EuiFieldNumber, EuiSelect, EuiIcon, EuiFieldText } from '@elastic/eui';
import { translate } from '../../../utils';
import { STAGE_TYPE } from '../../../types/enums';
import moment from 'moment';
import {getInterviewers} from '../../../redux/slices/interviewersSlice';

type RightPanelProps = {
    stageType: STAGE_TYPE | false;
    _id: string;
}

const RightPanelContent = ({ stageType, _id }: RightPanelProps) => {
    const dispatch = useAppDispatch();
    const flow = useAppSelector(getCurrentFlow);
    const allInterviewers = useAppSelector(getInterviewers);
    const [stage, setStage] = useState(flow.stages.find(e => e._id === _id));
    const [specifyDuration, setSpecifyDuration] = useState(stage?.startDate != null);
    const minDate = moment().add(1, 'd');
    const [startDate, setStartDate] = useState(moment(stage?.startDate));
    const [endDate, setEndDate] = useState(moment(stage?.endDate));
    const [isInvalid, setIsInvalid] = useState(startDate > endDate || startDate <= moment());
    const [testDuration, setTestDuration] = useState(stage?.testDuration);
    const [interviewLengthInMins, setInterviewLengthInMins] = useState(stage?.stageProps.interviewLengthInMins)
    const [interviewers, setInterviewers] = useState(stage?.stageProps.interviewers)

    const newArray = allInterviewers?.map(interviewer => {
        return {
            key: interviewer._id,
            text: interviewer.name
        };
    });

    useEffect(() => {
        const newStage = flow.stages.find(e => e._id === _id);
        setSpecifyDuration(newStage?.startDate !== null);
        setStartDate(moment(newStage?.startDate));
        setEndDate(moment(newStage?.endDate));
        setIsInvalid(startDate > endDate || startDate <= moment());
        setTestDuration(newStage?.testDuration);
        setInterviewLengthInMins(newStage?.stageProps.interviewLengthInMins);
        setInterviewers(newStage?.stageProps.interviewers)
    }, [flow, _id]);

    const handleSaveButton = () => {
        //if check yap state yoksa direkt hata ver
        if (stage) {
            dispatch(updateStageAsync({
                type: stage.type,
                stageID: stage.stageID,
                ...(testDuration && { testDuration }),
                ...(specifyDuration && { startDate: startDate.toString() }),
                ...(specifyDuration && { endDate: endDate.toString() })
            }));
        } else {
            alert('Changes are not saved!')
        }
        if (stage?.type === STAGE_TYPE.INTERVIEW) {
            dispatch(updateInterviewAsync({
                interviewLengthInMins: interviewLengthInMins,
                interviewers: interviewers
            }));
        }
    };

    const handleInterviewerAdd = (value: string) => {
        // value is interviewer name convert to interview _id first
        let idNo
        for(let i = 0; i < allInterviewers.length; i++){
            if(value === allInterviewers[i].name){
                idNo = allInterviewers[i]._id;
            }
        }

        // if idno is not already added to this interview add it
        for(let i = 0; i < interviewers.length; i++){
            if(idNo === interviewers[i]){
                return;
            }
        }
        setInterviewers([...interviewers, idNo])
    }

    const handleInterviewerDelete = (interviewerName: string) => {
        // find the interview id with given name
        let idNo
        for(let i = 0; i < allInterviewers.length; i++){
            if(interviewerName === allInterviewers[i].name){
                idNo = allInterviewers[i]._id;
            }
        }
        // remove the id from interviewers array
        for(let i = 0; i < interviewers.length; i++){
            if(idNo === interviewers[i]){
                const temp = [...interviewers];
                temp.splice(i,1);
                setInterviewers(temp);
            }
        }
    }
    
    const interviewerNames: string[] = []

    interviewers?.map((interviewer: string) => {
        for(let i = 0; i < allInterviewers.length; i++){
            if(interviewer === allInterviewers[i]._id){
                interviewerNames.push(allInterviewers[i].name)
            }
        }
    })
    
    return (
        <div className={styles.contentContainer}>
            <EuiFormRow label={translate('Specify Duration')} >
                <EuiSwitch
                    label=''
                    checked={specifyDuration}
                    onChange={({ target: { checked } }) => setSpecifyDuration(checked)}
                />
            </EuiFormRow>
            <EuiSpacer />
            {specifyDuration && <>
                <EuiFormRow label={translate('Start Date')}>
                    <EuiDatePicker
                        selected={startDate}
                        onChange={date => {
                            if (date)
                                setStartDate(date);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={minDate}
                        maxDate={endDate}
                        isInvalid={isInvalid}
                        aria-label="Start date"
                        showTimeSelect
                        timeFormat='HH:mm'
                    />
                </EuiFormRow>
                <EuiSpacer />
                <EuiFormRow label={translate('End Date')}>
                    <EuiDatePicker
                        selected={endDate}
                        onChange={date => {
                            if (date)
                                setEndDate(date);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        isInvalid={isInvalid}
                        aria-label="End date"
                        showTimeSelect
                        timeFormat='HH:mm'
                    />
                </EuiFormRow></>
            }
            {stageType === STAGE_TYPE.TEST && <EuiFormRow label={translate('Test Duration')}>
                <EuiFieldNumber
                    min={0}
                    step={5}
                    append={translate('Minutes')}
                    value={testDuration}
                    onChange={({ target: { value } }) => setTestDuration(parseInt(value))}
                />
            </EuiFormRow>}
            {stageType === STAGE_TYPE.INTERVIEW && <div className={styles.div}>
                <EuiFormRow label={translate('Length in minutes')}>
                    <EuiFieldNumber
                        min={0}
                        step={5}
                        append={translate('Minutes')}
                        value={interviewLengthInMins}
                        onChange={({ target: { value } }) => setInterviewLengthInMins(parseInt(value))}
                    />
                </EuiFormRow>
                <EuiFormRow label={translate('Interviewers')}>
                    <EuiSelect
                        fullWidth
                        options={newArray}
                        onChange={({ target: { value } }) => handleInterviewerAdd(value)}
                    />
                </EuiFormRow>
                {interviewerNames.map((interviewerName: string) => (
                    <div
                        key={interviewerName}
                    >
                        <table>
                            <tbody>
                                <tr>
                                    <th className={styles.th1}>
                                        <p className={styles.input}>{interviewerName}</p>
                                    </th>
                                    <th>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleInterviewerDelete(interviewerName)}
                                        >
                                            <EuiIcon type='cross'></EuiIcon>
                                        </button>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>}
            <EuiSpacer />
            <EuiFormRow>
                <EuiButton onClick={handleSaveButton}>
                    Save
                </EuiButton>
            </EuiFormRow>
        </div>
    );
};

export default RightPanelContent;