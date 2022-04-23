import React, { useMemo, FunctionComponent, ReactNode } from "react";
import { Stage, Condition } from '../../types/models';
import StageCard from './StageCard';
import ConditionElement from './ConditionElement';
import classNames from 'classnames';
import styles from './FlowRenderer.module.scss';
import { translate } from '../../utils';
import { EuiText } from '@elastic/eui';
import { STAGE_TYPE } from '../../types/enums';

type mode = 'edit' | 'submission';
type AdditionalProps<T> = T extends 'edit' ? {
    onAddStartFormClick: () => void,
    onNewStageClick: (stageType: STAGE_TYPE) => void
} : {
    applicantCounts: {
        stageIndex: number,
        completed: boolean,
        count: number
    }[],
    setStageFilter: (stageIndex: number, stageCompleted: boolean) => void,
    resetStageFilter: () => void,
    activeStageFilter: {
        stageIndex: number,
        stageCompleted: boolean
    }
};
type FlowRendererProps<T> = {
    stages: Stage[];
    conditions: Condition[];
    className?: string;
    mode: T,
    additionalProps: AdditionalProps<T>
};

function FlowRenderer<T extends mode>({
    stages,
    conditions,
    className,
    mode,
    additionalProps
}: FlowRendererProps<T>): JSX.Element {
    const applicantCounts = useMemo(() => (additionalProps as AdditionalProps<'submission'>).applicantCounts || [], [additionalProps]);
    const setStageFilter = useMemo(() => (additionalProps as AdditionalProps<'submission'>).setStageFilter || [], [additionalProps]);
    const resetStageFilter = useMemo(() => (additionalProps as AdditionalProps<'submission'>).resetStageFilter || [], [additionalProps]);
    const activeStageFilter = useMemo(() => (additionalProps as AdditionalProps<'submission'>).activeStageFilter || [], [additionalProps]);
    const onAddStartFormClick = (additionalProps as AdditionalProps<'edit'>).onAddStartFormClick;
    const handleNewStageClick = (stageType: STAGE_TYPE) => () => {
        (additionalProps as AdditionalProps<'edit'>).onNewStageClick(stageType)
    }

    const stagesAndConditions = useMemo(() => stages.reduce((acc: JSX.Element[], stage, index, stageArray) => {
        const notCompletedCount = applicantCounts.find(({ stageIndex, completed }) => !completed && stageIndex === index)?.count;
        const notCompletedIsActiveFilter = activeStageFilter.stageIndex === index && !activeStageFilter.stageCompleted;
        const completedCount = applicantCounts.find(({ stageIndex, completed }) => completed && stageIndex === index)?.count;
        const completedIsActiveFilter = activeStageFilter.stageIndex === index && activeStageFilter.stageCompleted;
        const stageElement = <div style={{ position: 'relative' }}>
            <div 
                className={classNames(styles.applicantCount, styles.top, { [styles.active]: notCompletedIsActiveFilter })}
                onClick={() => {
                    if (notCompletedIsActiveFilter) {
                        resetStageFilter();
                    } else {
                        setStageFilter(index, false);
                    }
                }}
            >
                {notCompletedCount || '0'}
            </div>
            <StageCard
                {...stage}
                name={stage.stageProps.name} 
                key={stage._id}
                id={stage._id}
                mode={mode}
            />
            <div 
                className={classNames(styles.applicantCount, styles.bottom, { [styles.active]: completedIsActiveFilter })}
                onClick={() => {
                    if (completedIsActiveFilter) {
                        resetStageFilter();
                    } else {
                        setStageFilter(index, true);
                    }
                }}
            >
                {completedCount || '0'}
            </div>
        </div>;
        const condition = conditions.find(e => e.from === stageArray[index]._id && e.to === stageArray[index + 1]._id);
        const conditionElement = <ConditionElement key={condition?._id || index} {...condition} />;
        if (index + 1 === stageArray.length) {
            return [...acc, stageElement];
        }
        return [...acc, stageElement, conditionElement];
    }, []), [stages, conditions, mode, applicantCounts]);

    return (
        <div className={classNames(styles.container, className)}>
            {stagesAndConditions}
            {mode === 'edit' && (stages.length === 0 ? <div 
                className={styles.addFormButton}
                onClick={onAddStartFormClick}
            >
                <EuiText className={styles.text}>
                    {translate('Add Start Form')}
                </EuiText>
            </div> : <>
                <div className={styles.dummyArrow}/>
                <div className={styles.newStage}>
                    <div 
                        onClick={handleNewStageClick(STAGE_TYPE.FORM)}
                        className={classNames(styles.new, styles.form)}
                    >
                        {translate('Form')}
                    </div>
                    <div 
                        onClick={handleNewStageClick(STAGE_TYPE.TEST)}
                        className={classNames(styles.new, styles.test)}
                    >
                        {translate('Test')}
                    </div>
                    <div 
                        onClick={handleNewStageClick(STAGE_TYPE.INTERVIEW)}
                        className={classNames(styles.new, styles.interview)}
                    >
                        {translate('Interview')}
                    </div>
                </div>
            </>)}
        </div>
    );

}

export default FlowRenderer;
