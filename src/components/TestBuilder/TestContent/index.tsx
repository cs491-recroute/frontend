import React from 'react';
import styles from './TestContent.module.scss';
import { Test } from '../../../types/models';
import { Paper } from '@mui/material';
import { QUESTION_MAPPINGS } from '../Questions/constants';
import { Divider } from '@mui/material';

type TestContentProps = {
    test: Test;
    editMode?: boolean;
}
const TestContent = ({ test, editMode }: TestContentProps) => {
    return <div className={styles.container}>
        <Paper className={styles.questionList} elevation={4}>
            {test.questions.map((question, index) => {
                const { Renderer } = QUESTION_MAPPINGS[question.type];
                return <>
                    <Renderer 
                        {...question} 
                        editMode={editMode} 
                        key={question._id} 
                        number={index + 1}
                    />
                    <hr className={styles.divider}/>
                </>;
            })}
        </Paper>
    </div>
};

export default TestContent;