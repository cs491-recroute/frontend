import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import React from 'react';

type HeaderProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Header = ({ required, title, placeholder, editMode }: HeaderProps) => {
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

export default Header;