import { EuiCard, EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { STAGE_TYPE } from '../../constants';
import styles from './StageCard.module.scss';

type StageCardProps = {
    type: STAGE_TYPE;
    name: string;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const stageIcons : {[key in STAGE_TYPE]: string} = {
	[STAGE_TYPE.FORM]: 'indexEdit',
	[STAGE_TYPE.TEST]: 'indexEdit',
	[STAGE_TYPE.INTERVIEW]: 'indexEdit'
};

const StageCard = ({type, name, ...rest}: StageCardProps) => {

	return (
		<div {...rest} className={styles.container}>
			<EuiCard
				className={classNames(styles.card, styles[type])}
				icon={<EuiIcon size="xl" type={stageIcons[type]} />}
				title={<div>{name}</div>}
				description=''
			/>
		</div>
	);
};

export default StageCard;