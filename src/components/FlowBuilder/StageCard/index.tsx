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

type StageCardProps = {
    type: STAGE_TYPE;
    name: string;
    id: string;
    stageID: string;
} & Stage;

const stageIcons: { [key in STAGE_TYPE]: string } = {
    [STAGE_TYPE.FORM]: 'indexEdit',
    [STAGE_TYPE.TEST]: 'indexEdit',
    [STAGE_TYPE.INTERVIEW]: 'indexEdit'
};

const StageCard = ({ type, name, id, stageID }: StageCardProps) => {
    const dispatch = useAppDispatch();
    const onClick = () => dispatch(toggleRightPanel({ stageType: type, _id: id, stageID: stageID }));
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

    return (
        <div className={styles.container}>
            <BuildCircleIcon onClick={goToBuilder} className={styles.builderIcon} />
            <DeleteForever onClick={deleteStage} className={styles.deleteIcon} />

            <EuiCard
                onClick={onClick}
                layout='horizontal'
                className={classNames(styles.card, styles[type.toLowerCase()])}
                icon={<EuiIcon size="xl" type={stageIcons[type]} />}
                title={<div>{name}</div>}
                description=''
            />
        </div>
    );
};

export default StageCard;