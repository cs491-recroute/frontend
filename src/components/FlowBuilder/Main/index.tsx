import React, { useMemo } from 'react';
import styles from './Main.module.scss';
import { Stage, Condition } from '../../../types/models';
import StageCard from '../StageCard';
import ConditionElement from '../ConditionElement';
import { useAppDispatch } from '../../../utils/hooks';
import { toggleLeftPanel } from '../../../redux/slices/flowBuilderSlice';
import { EuiText } from '@elastic/eui';
import { translate } from '../../../utils';
import classNames from 'classnames';

type MainProps = {
  stages: Stage[];
  conditions: Condition[];
  className: string;
}

const Main = ({ stages, conditions, className }: MainProps) => {
	const dispatch = useAppDispatch();
	const stagesAndConditions = useMemo(() => stages.reduce((acc: JSX.Element[], stage, index, stageArray) => {
		const stageElement = <StageCard
			type={stage.type} 
			name={stage.stageProps.name} 
			key={stage._id}
			id={stage._id}
		/>;
		const condition = conditions.find(condition => condition.from === stageArray[index]._id && condition.to === stageArray[index + 1]._id);
		const conditionElement = <ConditionElement {...condition} />;
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
					onClick={() => dispatch(toggleLeftPanel(true))}
				>
					<EuiText className={styles.text}>
						{translate('Add Start Form')}
					</EuiText>
				</div>
			) : (
				<>
					<div className={styles.dummyArrow}/>
					<div className={styles.newStage}>
						{/* TODO: Implement onclick functions for below elements */}
						<div onClick={() => dispatch(toggleLeftPanel(true))}>{translate('Form')}</div>
						<div>{translate('Test')}</div>
						<div>{translate('Interview')}</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Main;