import React from 'react';
import { Stage, Condition } from '../../../types/models';
import { useAppDispatch } from '../../../utils/hooks';
import { toggleLeftPanel, addStageAsync } from '../../../redux/slices/flowBuilderSlice';
import { STAGE_TYPE } from '../../../types/enums';
import FlowRenderer from '../../FlowRenderer';

type MainProps = {
  stages: Stage[];
  conditions: Condition[];
  className: string;
}

const Main = ({ stages, conditions, className }: MainProps) => {
    const dispatch = useAppDispatch();
    return <FlowRenderer 
        stages={stages}
        conditions={conditions}
        className={className}
        mode='edit'
        additionalProps={{
            onAddStartFormClick: () => dispatch(toggleLeftPanel(STAGE_TYPE.FORM)),
            onNewStageClick: (stageType: STAGE_TYPE) => {
                if (stageType === STAGE_TYPE.INTERVIEW) {
                    dispatch(addStageAsync({ type: STAGE_TYPE.INTERVIEW }))
                } else {
                    dispatch(toggleLeftPanel(stageType))
                }
            }
        }}
    />
};

export default Main;