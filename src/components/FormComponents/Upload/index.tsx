import { EuiFilePicker, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ComponentTypes } from '../../../types/models';
import { translate } from '../../../utils';

type UploadProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Upload = forwardRef(({ required, title, placeholder, editMode }: UploadProps, ref) => {
    const [answer, setAnswer] = useState({});
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(translate('This field is required'));

    const triggerError = (message = errorMessage) => {
        setErrorMessage(message);
        setError(true);
    }

    const clearError = () => {
        setError(false);
        setErrorMessage(translate('This field is required'));
    }

    useImperativeHandle(ref, () => ({ answer, invalid: (required && !answer) || error, triggerError, type: ComponentTypes.upload }));

    const onChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const filesArr = Array.from(files);
            if (filesArr.length > 3) {
                triggerError(translate('Maximum 3 files are allowed'));
            }
            else if (filesArr.findIndex(x => x.size > 52428800) !== -1) {
                triggerError(translate('Maximum file size is 50MB'));
            }
            else {
                clearError();
                setAnswer(files.length > 0 ? Array.from(files) : []);
            }
        }
        else {
            clearError();
            setAnswer([]);
        }
    };

    return <EuiFormRow
        label={title}
        fullWidth
        isInvalid={error}
        error={errorMessage}
    >
        <EuiFilePicker
            fullWidth
            multiple
            formEncType='multipart/form-data'
            formAction=''
            name='file'
            onChange={onChange}
            required={required}
            initialPromptText={placeholder}
            disabled={false}
        />
    </EuiFormRow>

});

Upload.displayName = 'Upload';

export default Upload;