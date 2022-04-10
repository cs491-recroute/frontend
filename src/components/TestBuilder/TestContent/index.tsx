import React, { createRef, RefObject, useState } from 'react';
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
import { toast } from 'react-toastify';

type TestContentProps = {
    test: Test;
    editMode?: boolean;
    /** in minutes */
    duration?: number;
    userIdentifier?: string;
}
const TestContent = ({ test, editMode, duration, userIdentifier }: TestContentProps) => {
    const [finished, setFinished] = useState(false);
    const questionRefs: { [key: string]: RefObject<{ answer: any; }> } = {};
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

    const handleSubmit = () => {
        const answers = Object.entries(questionRefs).map(([questionID, { current }]) => ({
            questionID,
            answer: current?.answer
        }));
        // TODO: Send results to Next.js api, calculate grades and send to backend
        console.log({answers, userIdentifier});
        setFinished(true);
    };

    if (finished) {
        return <Paper elevation={10} className={styles.finishModal} >
            <h1>{translate('Test finished')}</h1>
        </Paper>;
    }
    return <div className={classNames(styles.container, { [styles.fillingMode]: !editMode })}>
        {!editMode && duration && 
            <Countdown 
                date={Date.now() + duration * 60 * 1000} 
                renderer={countdownRenderer} 
                onComplete={handleSubmit}
                onTick={({ total }) => {
                    if (total === 600000) {
                        toast(translate('10 minutes left! Your answers will be automatically submitted on timeout.'), {
                            position: 'top-center',
                            type: 'info',
                            hideProgressBar: true,
                            autoClose: false
                        });
                    }
                }}
            />
        }
        <Paper className={styles.questionList} elevation={4}>
            {test.questions.map((question, index) => {
                const { Renderer } = QUESTION_MAPPINGS[question.type];

                const newRef = createRef<{ answer: any; }>();
                questionRefs[question._id] = newRef;
                return <div className={styles.question} key={question._id} >
                    <Renderer 
                        {...question}
                        ref={newRef}
                        editMode={editMode} 
                        number={index + 1}
                    />
                    {editMode && <IconButton className={styles.editButton} onClick={handleSettingsClick(question)}>
                        <SettingsIcon />
                    </IconButton>}
                    <hr />
                </div>;
            })}
            {!editMode && <Button 
                variant='contained' 
                color='success' 
                className={styles.submitButton}
                onClick={handleSubmit}
            >
                {translate('SUBMIT')}
            </Button>}
        </Paper>
    </div>
};

export default TestContent;