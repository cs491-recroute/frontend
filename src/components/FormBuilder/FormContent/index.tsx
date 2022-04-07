import React from 'react';
import styles from './FormContent.module.scss';
import { Form } from '../../../types/models';
import { Paper } from '@mui/material';
import { COMPONENT_MAPPINGS } from '../../../constants';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync} from '../../../redux/slices/formBuilderSlice';
import { EuiIcon } from '@elastic/eui';
import { Button } from '@mui/material';
import { translate } from '../../../utils';

type FormContentProps = {
    form: Form;
    editMode?: boolean;
}
const FormContent = ({ form, editMode }: FormContentProps) => {
    const dispatch = useAppDispatch();

    const handleComponentDelete = (_id : string) => {
        if(_id){
            dispatch(deleteComponentAsync(_id));
        } else {
            console.log("Error while deleting component from form");
        }
    };

    return <div className={styles.container}>
        <Paper className={styles.questionList} elevation={4}>
            {form.components.map(({ type, _id, ...props }) => {
                const Renderer = COMPONENT_MAPPINGS[type]?.Renderer;
                if (!Renderer) return <div>Component renderer is not found!</div>;
                return <><Renderer
                    {...props}
                    key={_id}
                    _id={_id}
                    editMode={editMode}
                />
                <button>
                    <EuiIcon type="gear"/>
                </button>
                <button  onClick={() => handleComponentDelete(_id)}>
                    <EuiIcon type="trash" />
                </button></>;
            })}
            {!editMode && <Button 
                variant='contained' 
                color='success' 
                className={styles.submitButton}
                // onClick={handleSubmit}
            >
                {translate('SUBMIT')}
            </Button>}
        </Paper>
    </div>
}

export default FormContent;