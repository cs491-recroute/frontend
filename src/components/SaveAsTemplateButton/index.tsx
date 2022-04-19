import { IconButton } from '@mui/material';
import React, { useRef } from 'react';
import { getCategoriesAsync } from '../../redux/slices/testBuilderSlice';
import { Question } from '../../types/models';
import { useAppDispatch } from '../../utils/hooks';
import SaveAsTemplateModal, { SaveAsTemplateModalRef } from '../SaveAsTemplateModal';
import SaveIcon from '@mui/icons-material/Save';

type SaveAsTemplateButtonProps = {
    question: Question,
    className: string;
};

const SaveAsTemplateButton = ({ question, className }: SaveAsTemplateButtonProps) => {
    const saveAsTemplateRef = useRef<SaveAsTemplateModalRef>(null);
    const dispatch = useAppDispatch();

    const handleSaveClick = () => {
        dispatch(getCategoriesAsync());
        saveAsTemplateRef.current?.open() 
    };

    return (
        <>
            <IconButton className={className} onClick={handleSaveClick}>
                <SaveIcon />
            </IconButton>
            <SaveAsTemplateModal question={question} ref={saveAsTemplateRef}/>
        </>

    );
};

export default SaveAsTemplateButton;