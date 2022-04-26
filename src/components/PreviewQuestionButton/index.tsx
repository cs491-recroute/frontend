import { ListItemButton, ListItemText } from '@mui/material';
import React, { useRef } from 'react';
import { Question } from '../../types/models';
import { useAppDispatch } from '../../utils/hooks';
import PreviewQuestionModal, { PreviewQuestionModalRef } from '../PreviewQuestionModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { addQuestionAsync } from '../../redux/slices/testBuilderSlice';

type PreviewQuestionButtonProps = {
    question: Question
};

const PreviewQuestionButton = ({ question }: PreviewQuestionButtonProps) => {
    const previewQuestionRef = useRef<PreviewQuestionModalRef>(null);
    const dispatch = useAppDispatch();

    const handleBasicSelect = (defaultProps: Partial<Question>) => () => {
        dispatch(addQuestionAsync(defaultProps));
    };

    return (
        <>
            <ListItemButton style={{height: '50px'}}>
                <ListItemText onClick={handleBasicSelect(question)} primary={question.name}/>
                <VisibilityIcon onClick={() => previewQuestionRef.current?.open()}/>
            </ListItemButton>
            <PreviewQuestionModal question={question} ref={previewQuestionRef} />
        </>

    );
};

export default PreviewQuestionButton;