import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React from 'react';

type ShortTextProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const ShortText = ({ required, title, placeholder, editMode }: ShortTextProps) => {
    return <EuiFormRow label={title} fullWidth>
        <EuiFieldText 
            fullWidth 
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
        />
    </EuiFormRow>
};

export default ShortText;