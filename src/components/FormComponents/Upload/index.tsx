import { EuiFilePicker, EuiFormRow } from '@elastic/eui';
import React from 'react';

type UploadProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Upload = ({ required, title, placeholder, editMode }: UploadProps) => {
    return <EuiFormRow label={title} fullWidth>
        <EuiFilePicker
            fullWidth
            multiple
            required={required} 
            initialPromptText= {placeholder}
            disabled ={editMode}
        />
    </EuiFormRow>
            
};

export default Upload;