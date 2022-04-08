import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React from 'react';

type EmailProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Email = ({ required, title, placeholder, editMode }: EmailProps) => {
    return <EuiFormRow label={title} fullWidth>
        <EuiFieldText 
            fullWidth
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
        />
    </EuiFormRow>
            
};

export default Email;