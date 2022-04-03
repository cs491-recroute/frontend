import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import React from 'react';

type LongTextProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const LongText = ({ required, title, placeholder, editMode }: LongTextProps) => {
    return <EuiFormRow label={title} fullWidth>
        <EuiTextArea 
            fullWidth 
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
            resize={editMode ? 'none' : 'vertical'}
        />
    </EuiFormRow>
};

export default LongText;