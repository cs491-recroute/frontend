import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React from 'react';

type AddressProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Address = ({ required, title, placeholder, editMode }: AddressProps) => {
    return <EuiFormRow label={title} fullWidth>
        <EuiFieldText 
            fullWidth
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
        />
    </EuiFormRow>
            
};

export default Address;