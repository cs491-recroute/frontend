import React from 'react';
import { Condition } from '../../types/models';
import styles from './Condition.module.scss';

const Condition = ({ operation }: Partial<Condition>) => {
	// TODO: Open modal for editing condition on click
	return (
		<div className={styles.container}>
			<div className={styles.conditionBox}>
				{operation}
			</div>
		</div>
	);
};

export default Condition;