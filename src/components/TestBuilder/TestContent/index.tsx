import React from 'react';
import styles from './TestContent.module.scss';
import { Test, Question } from '../../../types/models';
import { Paper } from '@mui/material';
import { QUESTION_MAPPINGS } from '../Questions/constants';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { useAppDispatch } from '../../../utils/hooks';
import { toggleRightPanel } from '../../../redux/slices/testBuilderSlice';

type TestContentProps = {
    test: Test;
    editMode?: boolean;
}
const TestContent = ({ test, editMode }: TestContentProps) => {
    const dispatch = useAppDispatch();
    const handleSettingsClick = (question: Question) => () => {
        dispatch(toggleRightPanel({ status: true, question }));
    };

    return <div className={styles.container}>
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
        </Paper>
    </div>
};

export default TestContent;