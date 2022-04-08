import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React from 'react';

type PhoneProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Phone = ({ required, title, placeholder, editMode }: PhoneProps) => {
    return <EuiFormRow label={title} fullWidth>
        <EuiFieldText 
            fullWidth
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
        />
    </EuiFormRow>
            
};

export default Phone;