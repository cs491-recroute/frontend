import React, { useMemo } from 'react';
import styles from './Main.module.scss';
import { Stage, Condition } from '../../../types/models';
import StageCard from '../StageCard';
import ConditionElement from '../ConditionElement';
import { useAppDispatch } from '../../../utils/hooks';
import { toggleLeftPanel, addStageAsync } from '../../../redux/slices/flowBuilderSlice';
import { EuiText } from '@elastic/eui';
import { translate } from '../../../utils';
import classNames from 'classnames';
import { STAGE_TYPE } from '../../../types/enums';

type MainProps = {
  stages: Stage[];
  conditions: Condition[];
  className: string;
}

const Main = ({ stages, conditions, className }: MainProps) => {
    const dispatch = useAppDispatch();
    const stagesAndConditions = useMemo(() => stages.reduce((acc: JSX.Element[], stage, index, stageArray) => {
        const stageElement = <StageCard
            {...stage}
            name={stage.stageProps.name} 
            key={stage._id}
            id={stage._id}
        />;
        const condition = conditions.find(e => e.from === stageArray[index]._id && e.to === stageArray[index + 1]._id);
        const conditionElement = <ConditionElement key={condition?._id || index} {...condition} />;
        if (index + 1 === stageArray.length) {
            return [...acc, stageElement];
        }
        return [...acc, stageElement, conditionElement];
    }, []), [stages, conditions]);

    return (
        <div className={classNames(styles.container, className)}>
            {stagesAndConditions}
            {stages.length === 0 ? (
                <div 
                    className={styles.addFormButton}
                    onClick={() => dispatch(toggleLeftPanel(STAGE_TYPE.FORM))}
                >
                    <EuiText className={styles.text}>
                        {translate('Add Start Form')}
                    </EuiText>
                </div>
            ) : (
                <>
                    <div className={styles.dummyArrow}/>
                    <div className={styles.newStage}>
                        <div 
                            onClick={() => dispatch(toggleLeftPanel(STAGE_TYPE.FORM))}
                            className={classNames(styles.new, styles.form)}
                        >
                            {translate('Form')}
                        </div>
                        <div 
                            onClick={() => dispatch(toggleLeftPanel(STAGE_TYPE.TEST))}
                            className={classNames(styles.new, styles.test)}
                        >
                            {translate('Test')}
                        </div>
                        <div 
                            onClick={() => dispatch(addStageAsync({ type: STAGE_TYPE.INTERVIEW }))}
                            className={classNames(styles.new, styles.interview)}
                        >
                            {translate('Interview')}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Main;