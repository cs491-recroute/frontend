import { EuiCard, EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { deleteStageAsync, toggleRightPanel } from '../../../redux/slices/flowBuilderSlice';
import { STAGE_TYPE } from '../../../types/enums';
import { useAppDispatch } from '../../../utils/hooks';
import styles from './StageCard.module.scss';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { STAGE_PROPS } from '../../../constants';
import { useRouterWithReturnBack } from '../../../utils/hooks';
import { Stage } from '../../../types/models';
import { DeleteForever } from '@mui/icons-material';
import { getInterviewersAsync } from '../../../redux/slices/interviewersSlice';

type StageCardProps = {
    type: STAGE_TYPE;
    name: string;
    id: string;
    stageID: string;
    mode: 'edit' | 'submission'
} & Stage;

const stageIcons: { [key in STAGE_TYPE]: string } = {
    [STAGE_TYPE.FORM]: 'indexEdit',
    [STAGE_TYPE.TEST]: 'indexEdit',
    [STAGE_TYPE.INTERVIEW]: 'indexEdit'
};

const StageCard = ({ type, name, id, stageID, mode }: StageCardProps) => {
    const dispatch = useAppDispatch();
    const onClick = () => {
        dispatch(toggleRightPanel({ stageType: type, _id: id, stageID: stageID }));
        if (type === STAGE_TYPE.INTERVIEW) dispatch(getInterviewersAsync());
    }
    const { pushWithReturn } = useRouterWithReturnBack();

    const goToBuilder = () => {
        const { builderURL } = STAGE_PROPS[type];
        if (builderURL) {
            pushWithReturn(`/${builderURL}/${stageID}`);
        }
    };
    const deleteStage = () => {
        if (id) {
            dispatch(deleteStageAsync(id));
        } else {
            alert('Stage was not deleted!')
        }
    };

    const layout = mode === 'edit' ? 'horizontal' : 'vertical';
    return (
        <div className={classNames(styles.container, { [styles.editMode]: mode === 'edit', [styles.submissionMode]: mode === 'submission' })}>
            {mode === 'edit' && (
                <>
                    <BuildCircleIcon onClick={onClick} className={styles.builderIcon} />
                    <DeleteForever onClick={deleteStage} className={styles.deleteIcon} />
                </>
            )}

            <EuiCard
                onClick={mode === 'edit' ? goToBuilder : undefined}
                layout={layout as any}
                className={classNames(styles.card, styles[type.toLowerCase()])}
                icon={<EuiIcon size="xl" type={stageIcons[type]} />}
                title={<div>{name}</div>}
                description=''
            />
        </div>
    );
};

export default StageCard;