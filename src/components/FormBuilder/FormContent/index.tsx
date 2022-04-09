import React, { RefObject, createRef } from 'react';
import styles from './FormContent.module.scss';
import { Form, Component } from '../../../types/models';
import { Paper } from '@mui/material';
import { COMPONENT_MAPPINGS } from '../../../constants';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync, toggleRightPanel} from '../../../redux/slices/formBuilderSlice';
import { EuiIcon } from '@elastic/eui';
import { Button } from '@mui/material';
import { translate } from '../../../utils';

type FormContentProps = {
    form: Form;
    editMode?: boolean;
}
const FormContent = ({ form, editMode }: FormContentProps) => {
    const componentRefs: { [key: string]: RefObject<{ answer: any; }> } = {};
    const dispatch = useAppDispatch();

    const handleSettingsClick = (component: Component) => () => {
        dispatch(toggleRightPanel({ status: true, component }));
    };

    const handleComponentDelete = (_id : string) => {
        if(_id){
            dispatch(deleteComponentAsync(_id));
        } else {
            console.log("Error while deleting component from form");
        }
    };

    const handleSubmit = () => {
        const answers = Object.keys(componentRefs).reduce((acc, ref) => {
            return { ...acc, [ref]: componentRefs[ref]?.current?.answer };
        }, {});
        // TODO: Send results to backend 
        console.log(answers);
    };

    return <div className={styles.container}>
        <Paper className={styles.questionList} elevation={4}>
            {form.components.map( component => {
                const { Renderer, viewComponent } = COMPONENT_MAPPINGS[component.type];
                if (!Renderer) return <div>Component renderer is not found!</div>;

                let newRef;
                if (!viewComponent) {
                    newRef = createRef<{ answer: any; }>();
                    componentRefs[component._id] = newRef;
                }
                return <div className={styles.question} key={component._id} data-componentID={component._id} >
                    <Renderer
                        {...component}
                        key={component._id}
                        _id={component._id}
                        editMode={editMode}
                        {...(!viewComponent && {
                            ref: newRef
                        })}
                    />
                    {editMode && <button className={styles.editButton} onClick={handleSettingsClick(component)}>
                        <EuiIcon type="gear"/>
                    </button>}
                    {editMode && <button  className={styles.deleteButton} onClick={() => handleComponentDelete(component._id)}>
                        <EuiIcon type="trash" />
                    </button>}
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
}

export default FormContent;