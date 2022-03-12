import { EuiCard, EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { toggleRightPanel } from '../../../redux/slices/flowBuilderSlice';
import { STAGE_TYPE } from '../../../types/enums';
import { useAppDispatch } from '../../../utils/hooks';
import styles from './StageCard.module.scss';

type StageCardProps = {
    type: STAGE_TYPE;
    name: string;
		id: string;
}

const stageIcons : {[key in STAGE_TYPE]: string} = {
	[STAGE_TYPE.FORM]: 'indexEdit',
	[STAGE_TYPE.TEST]: 'indexEdit',
	[STAGE_TYPE.INTERVIEW]: 'indexEdit'
};

const StageCard = ({ type, name, id }: StageCardProps) => {
	const dispatch = useAppDispatch();
	const onClick = () => dispatch(toggleRightPanel(true));
	
	console.log(id);
	// TODO: @goktug id refers to stage id.

	return (
		<div onClick={onClick} className={styles.container}>
			<EuiCard
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