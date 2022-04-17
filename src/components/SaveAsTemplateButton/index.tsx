import { EuiButtonEmpty } from '@elastic/eui';
import { IconButton } from '@mui/material';
import React, { useRef } from 'react';
import { getCategoriesAsync } from '../../redux/slices/testBuilderSlice';
import { Question } from '../../types/models';
import { useAppDispatch } from '../../utils/hooks';
import SaveAsTemplateModal, { SaveAsTemplateModalRef } from '../SaveAsTemplateModal';
import SaveIcon from '@mui/icons-material/Save';
import styles from './SaveAsTemplateButton.module.scss';

type SaveAsTemplateButtonProps = {
    question: Question
};

const SaveAsTemplateButton = ({ question }: SaveAsTemplateButtonProps) => {
    const saveAsTemplateRef = useRef<SaveAsTemplateModalRef>(null);
    const dispatch = useAppDispatch();

    const handleSaveClick = () => {
        dispatch(getCategoriesAsync());
        saveAsTemplateRef.current?.open() 
    };

    return (
        <>
            <IconButton className={styles.saveButton} onClick={handleSaveClick}>
                <SaveIcon />
            </IconButton>
            <SaveAsTemplateModal question={question} ref={saveAsTemplateRef}/>
        </>

    );
};

export default SaveAsTemplateButton;