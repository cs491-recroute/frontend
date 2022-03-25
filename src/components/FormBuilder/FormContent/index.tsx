import React from 'react';
import styles from './FormContent.module.scss';
import { Form } from '../../../types/models';
import { Paper } from '@mui/material';
import { COMPONENT_MAPPINGS } from '../../../constants';

type FormContentProps = {
    form: Form;
    editMode?: boolean;
}
const FormContent = ({ form, editMode }: FormContentProps) => {
    return <div className={styles.container}>
        <Paper className={styles.questionList} elevation={4}>
            {form.components.map(({ type, _id, ...props }) => {
                const Renderer = COMPONENT_MAPPINGS[type]?.Renderer;
                if (!Renderer) return <div>Component renderer is not found!</div>;
                return <Renderer 
                    {...props} 
                    key={_id} 
                    _id={_id} 
                    editMode={editMode}
                />;
            })}
        </Paper>
    </div>
}

export default FormContent;