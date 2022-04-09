import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';

type AddressProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Address = forwardRef(({ required, title, placeholder, editMode }: AddressProps, ref) => {
    const [answer, setAnswer] = useState('');

    useImperativeHandle(ref, () => ({ answer }));

    return <EuiFormRow label={title} fullWidth>
        <EuiFieldText 
            fullWidth
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
        />
    </EuiFormRow>
            
});

Address.displayName = 'Address';

export default Address;