import React, { RefObject, createRef, useState } from 'react';
import styles from './FormContent.module.scss';
import { Form, Component, ComponentTypes } from '../../../types/models';
import { Paper } from '@mui/material';
import { COMPONENT_MAPPINGS, ComponentRef } from '../../../constants';
import { useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync, toggleRightPanel } from '../../../redux/slices/formBuilderSlice';
import { EuiIcon } from '@elastic/eui';
import { Button } from '@mui/material';
import { translate } from '../../../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import ErrorIcon from '@mui/icons-material/Error';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import { EuiText } from '@elastic/eui';

type FormContentProps = {
    form: Form;
    editMode?: boolean;
    userIdentifier?: string;
    withEmail?: boolean;
}

const FormContent = ({ form, editMode, userIdentifier, withEmail }: FormContentProps) => {
    const [finishState, setFinishState] = useState({
        finished: false,
        success: false,
        message: ''
    });

    const componentRefs: { [key: string]: RefObject<ComponentRef> } = {};
    const dispatch = useAppDispatch();

    const handleSettingsClick = (component: Component) => () => {
        dispatch(toggleRightPanel({ status: true, component }));
    };

    const handleComponentDelete = (_id: string) => {
        if (_id) {
            dispatch(deleteComponentAsync(_id));
        } else {
            console.log("Error while deleting component from form");
        }
    };

    const handleSubmit = async () => {
        const answers = Object.entries(componentRefs)
            .filter(([, { current }]) => current)
            .map(([componentID, { current }]) => {
                const { answer, invalid, triggerError, type } = current || {};
                if (invalid && triggerError) {
                    triggerError();
                }
                return { componentID, answer, invalid, type };
            });
        const invalidAnswers = answers.filter(({ invalid }) => invalid);
        if (invalidAnswers.length > 0) {
            toast(translate('There is invalid fields in the form. Please correct them before submitting.'), {
                position: 'top-center',
                type: 'error',
                hideProgressBar: true,
                closeButton: false
            })
            return;
        }
        const formData = answers.map(({ componentID, answer, type }) => ({ componentID, value: (type !== ComponentTypes.upload) ? (answer || undefined) : undefined }));
        const filesMap = answers.filter(({ type }) => (type === ComponentTypes.upload));
        const body = new FormData();
        const formDataStr = JSON.stringify({ componentSubmissions: formData });
        if (filesMap) {
            for (const fileMap of filesMap) {
                for (const index in fileMap.answer) {
                    const file = fileMap.answer[parseInt(index)];
                    const fileformat = file.name.substring(file.name.lastIndexOf('.'));
                    const filename = `form-${form._id}-${fileMap.componentID}-${index}${fileformat}`;
                    body.append(fileMap.componentID, file, filename);
                }
            }
        }
        body.append('formData', formDataStr);

        try {
            await axios.post(`/api/submit/form/${form._id}`, body, { params: { userIdentifier, withEmail } });
            setFinishState({
                finished: true,
                success: true,
                message: translate('Form submitted successfully!')
            });
        } catch ({ response: { data } }: any) {
            setFinishState({
                finished: true,
                success: false,
                message: data as any
            })
        }
    };

    if (finishState.finished) {
        return <Paper elevation={10} className={styles.finishModal} >
            {finishState.success ?
                <SuccessIcon sx={{ fontSize: 250 }} color='success' /> :
                <ErrorIcon sx={{ fontSize: 250 }} color='error' />}
            <EuiText color={finishState.success ? 'success' : 'danger'} style={{ fontWeight: 'bold' }}>
                {finishState.message}
            </EuiText>
        </Paper>;
    }

    return <div className={styles.container}>
        <Paper className={styles.questionList} elevation={4}>
            {form.components.map(component => {
                const { Renderer, viewComponent } = COMPONENT_MAPPINGS[component.type];
                if (!Renderer) return <div>Component renderer is not found!</div>;

                let newRef;
                if (!viewComponent) {
                    newRef = createRef<ComponentRef>();
                    componentRefs[component._id] = newRef;
                }
                return <div className={styles.question} key={component._id} data-componentID={component._id} >
                    {component.required && <div className={styles.requiredBadge}>*</div>}
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
                        <EuiIcon type="gear" />
                    </button>}
                    {editMode && <button className={styles.deleteButton} onClick={() => handleComponentDelete(component._id)}>
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