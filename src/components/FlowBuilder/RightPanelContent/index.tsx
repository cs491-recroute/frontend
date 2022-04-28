import React, { useCallback, useEffect, useState } from 'react';
import styles from './RightPanelContent.module.scss';
import { Interviewer, Stage } from '../../../types/models';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { getCurrentFlow, updateInterviewAsync, updateStageAsync } from '../../../redux/slices/flowBuilderSlice';
import { EuiButton, EuiDatePicker, EuiFormRow, EuiSpacer, EuiSwitch, EuiFieldNumber, EuiSelect, EuiIcon, EuiFieldText } from '@elastic/eui';
import { translate } from '../../../utils';
import { STAGE_TYPE } from '../../../types/enums';
import moment from 'moment';
import { getInterviewers } from '../../../redux/slices/interviewersSlice';

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
    const [activeInterviewers, setActiveInterviewers] = useState(stage?.stageProps.interviewers);
    const [interviewerOptions, setInterviewerOptions] = useState([{ key: '', text: '' }])

    useEffect(() => {
        setInterviewerOptions(
            allInterviewers?.map(interviewer => {
                return {
                    key: interviewer._id,
                    text: interviewer.name
                };
            })
        );
    }, [allInterviewers]);

    useEffect(() => {
        setActiveInterviewers(
            allInterviewers.filter(x => interviewers.includes(x._id)).map(interviewer =>
                interviewer.name
            )
        );
    }, [allInterviewers, interviewers]);

    //for save button feedback
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [isFulfilled, setIsFulfilled] = useState(false);

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

    const handleSaveButton = async() => {
        //if check yap state yoksa direkt hata ver
        if (stage) {
            const response = await dispatch(updateStageAsync({
                type: stage.type,
                stageID: stage.stageID,
                ...(testDuration && { testDuration }),
                ...(specifyDuration && { startDate: startDate.toString() }),
                ...(specifyDuration && { endDate: endDate.toString() })
            }));
            setSaveButtonClicked(true);
            setTimeout(setSaveButtonClicked, 2000);
            if(response.type.search('fulfilled') === -1){
                //rejected
                setIsFulfilled(false);
            } else {
                //succesfull
                setIsFulfilled(true);
            }
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
        for (let i = 0; i < allInterviewers.length; i++) {
            if (value === allInterviewers[i].name) {
                idNo = allInterviewers[i]._id;
            }
        }

        // if idno is not already added to this interview add it
        for (let i = 0; i < interviewers.length; i++) {
            if (idNo === interviewers[i]) {
                return;
            }
        }
        setInterviewers([...interviewers, idNo])
    }

    const handleInterviewerDelete = (interviewerName: string) => {
        // find the interview id with given name
        let idNo
        for (let i = 0; i < allInterviewers.length; i++) {
            if (interviewerName === allInterviewers[i].name) {
                idNo = allInterviewers[i]._id;
            }
        }
        // remove the id from interviewers array
        for (let i = 0; i < interviewers.length; i++) {
            if (idNo === interviewers[i]) {
                const temp = [...interviewers];
                temp.splice(i, 1);
                setInterviewers(temp);
            }
        }
    }

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
                        options={interviewerOptions}
                        onChange={({ target: { value } }) => handleInterviewerAdd(value)}
                    />
                </EuiFormRow>
                {activeInterviewers.map((interviewerName: string) => (
                    <div
                        key={interviewerName}
                    >
                        <table>
                            <tbody>
                                <tr>
                                    <th className={styles.th1}>
                                        <p key={interviewerName} className={styles.input}>{interviewerName}</p>
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
                <table>
                    <tr>
                        <th className={styles.th}>
                            <EuiFormRow>  
                                <p className={styles.feedbackText1}> {saveButtonClicked && isFulfilled && translate('Saved Succesfully')}</p>
                            </EuiFormRow>
                            <EuiFormRow> 
                                <p className={styles.feedbackText2}> {saveButtonClicked && !isFulfilled && translate('Unseccessful Save')}</p>
                            </EuiFormRow>
                        </th>
                        <th> 
                            <EuiButton onClick={handleSaveButton} className={styles.saveButton}>{translate('Save')}</EuiButton>
                        </th>
                    </tr>
                </table>
            </EuiFormRow>
        </div>
    );
};

export default RightPanelContent;