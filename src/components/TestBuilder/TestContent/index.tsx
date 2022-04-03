import React from 'react';
import styles from './TestContent.module.scss';
import { Test, Question } from '../../../types/models';
import { Paper } from '@mui/material';
import { QUESTION_MAPPINGS } from '../Questions/constants';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Button } from '@mui/material';
import { useAppDispatch } from '../../../utils/hooks';
import { toggleRightPanel } from '../../../redux/slices/testBuilderSlice';
import { translate } from '../../../utils';
import classNames from 'classnames';
import Countdown, { CountdownRenderProps } from 'react-countdown';

type TestContentProps = {
    test: Test;
    editMode?: boolean;
    /** in minutes */
    duration?: number;
}
const TestContent = ({ test, editMode, duration }: TestContentProps) => {
    const dispatch = useAppDispatch();
    const handleSettingsClick = (question: Question) => () => {
        dispatch(toggleRightPanel({ status: true, question }));
    };

    const countdownRenderer = ({ hours, minutes, seconds }: CountdownRenderProps) => {
        const h = hours < 10 ? `0${hours}` : hours;
        const m = minutes < 10 ? `0${minutes}` : minutes;
        const s = seconds < 10 ? `0${seconds}` : seconds;

        return <Paper className={styles.countdown} >
            <b>{translate('Remaining time: ')}</b>
            {h}:{m}:{s}
        </Paper>
    };

    return <div className={classNames(styles.container, { [styles.fillingMode]: !editMode })}>
        {!editMode && duration && <Countdown date={Date.now() + duration * 60 * 1000 } renderer={countdownRenderer}/>}
        <Paper className={styles.questionList} elevation={4}>
            {test.questions.map((question, index) => {
                const { Renderer } = QUESTION_MAPPINGS[question.type];
                return <div className={styles.question} key={question._id} >
                    <Renderer 
                        {...question} 
                        editMode={editMode} 
                        number={index + 1}
                    />
                    {editMode && <IconButton className={styles.editButton} onClick={handleSettingsClick(question)}>
                        <SettingsIcon />
                    </IconButton>}
                    <hr />
                </div>;
            })}
            {!editMode && <Button variant='contained' color='success' className={styles.submitButton}>{translate('SUBMIT')}</Button>}
        </Paper>
    </div>
};

export default TestContent;