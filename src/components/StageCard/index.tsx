import { EuiCard, EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { STAGE_TYPE } from '../../constants';
import { toggleRightPanel } from '../../redux/slices/flowBuilderSlice';
import { useAppDispatch } from '../../utils/hooks';
import styles from './StageCard.module.scss';

type StageCardProps = {
    type: STAGE_TYPE;
    name: string;
}

const stageIcons : {[key in STAGE_TYPE]: string} = {
	[STAGE_TYPE.FORM]: 'indexEdit',
	[STAGE_TYPE.TEST]: 'indexEdit',
	[STAGE_TYPE.INTERVIEW]: 'indexEdit'
};

const StageCard = ({type, name }: StageCardProps) => {
	const dispatch = useAppDispatch();
	const onClick = () => dispatch(toggleRightPanel(true));
	

	return (
		<div onClick={onClick} className={styles.container}>
			<EuiCard
				className={classNames(styles.card, styles[type.toLowerCase()])}
				icon={<EuiIcon size="xl" type={stageIcons[type]} />}
				title={<div>{name}</div>}
				description=''
			/>
		</div>
	);
};

export default StageCard;