import React, { useCallback, useEffect, useState } from 'react';
import styles from './RightPanelContent.module.scss';
import { Stage } from '../../../types/models';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { getCurrentFlow, updateStageAsync } from '../../../redux/slices/flowBuilderSlice';
import { EuiButton, EuiDatePicker, EuiFormRow, EuiSpacer, EuiSwitch, EuiFieldNumber } from '@elastic/eui';
import { translate } from '../../../utils';
import { STAGE_TYPE } from '../../../types/enums';
import moment from 'moment';

type RightPanelProps = {
    stageType: STAGE_TYPE | false;
    stageId: string;
}

const RightPanelContent = ({ stageType, stageId }: RightPanelProps) => {
    const dispatch = useAppDispatch();
    const flow = useAppSelector(getCurrentFlow);
    const [stage, setStage] =  useState(flow.stages.find(e => e._id === stageId));
    const [specifyDuration, setSpecifyDuration] = useState(stage?.startDate != null);
    const minDate = moment().add(1, 'd');
    const [startDate, setStartDate] = useState(moment(stage?.startDate));
    const [endDate, setEndDate] = useState(moment(stage?.endDate));
    const [isInvalid, setIsInvalid] = useState(startDate > endDate || startDate <= moment());
    const [testDuration, setTestDuration] = useState(stage?.testDuration);

    useEffect(() => {
        const newStage = flow.stages.find(e => e._id === stageId);
        setSpecifyDuration(newStage?.startDate !== null);
        setStartDate(moment(newStage?.startDate));
        setEndDate(moment(newStage?.endDate));
        setIsInvalid(startDate > endDate || startDate <= moment());
        setTestDuration(newStage?.testDuration);
    }, [flow, stageId]);

    const handleSaveButton = () => {
        //if check yap state yoksa direkt hata ver
        if(stage){
            dispatch(updateStageAsync({
                type: stage.type,
                stageID: stage.stageID,
                ...(testDuration && { testDuration }),
                ...(specifyDuration && {startDate: startDate.toString()}),
                ...(specifyDuration && {endDate: endDate.toString()})
    
            }));
        }else{
            alert('Changes are not saved!')
        }

    };
    return (
        <div className={styles.contentContainer}>
            <EuiFormRow label={translate('Specify Duration')} >
                <EuiSwitch
                    label=''
                    checked={specifyDuration} 
                    onChange={({ target: { checked }}) => setSpecifyDuration(checked)}
                />
            </EuiFormRow>
            <EuiSpacer/>
            {specifyDuration && <><EuiFormRow label={translate('Start Date')}>
                <EuiDatePicker
                    selected={startDate}
                    onChange={date => {
                        if (date)
                            setStartDate(date);
                    } }
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    maxDate={endDate}
                    isInvalid={isInvalid}
                    aria-label="Start date"
                    showTimeSelect
                    timeFormat='HH:mm'
                />
            </EuiFormRow><EuiSpacer /><EuiFormRow label={translate('End Date')}>
                <EuiDatePicker
                    selected={endDate}
                    onChange={date => {
                        if (date)
                            setEndDate(date);
                    } }
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
                    onChange={({ target: { value }}) => setTestDuration(parseInt(value))}
                />
            </EuiFormRow>}
            <EuiSpacer/>
            <EuiFormRow>
                <EuiButton onClick={handleSaveButton}>
                    Save
                </EuiButton>
            </EuiFormRow>
        </div>
    );
};

export default RightPanelContent;