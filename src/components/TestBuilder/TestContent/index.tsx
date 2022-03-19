import React from 'react';
import styles from './TestContent.module.scss';
import { Test } from '../../../types/models';
import { Paper } from '@mui/material';
import { QUESTION_MAP } from '../Questions/constants';

type TestContentProps = {
    test: Test;
    editMode?: boolean;
}
const TestContent = ({ test, editMode }: TestContentProps) => {
    return <div className={styles.container}>
        <Paper className={styles.questionList} elevation={4}>
            {test.questions.map(question => {
                const { Renderer } = QUESTION_MAP[question.type];
                return <Renderer {...question} editMode={editMode} key={question._id} />;
            })}
        </Paper>
    </div>
};

export default TestContent;