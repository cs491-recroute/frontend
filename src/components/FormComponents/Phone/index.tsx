import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';

type PhoneProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Phone = forwardRef(({ required, title, placeholder, editMode }: PhoneProps, ref) => {
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

Phone.displayName = 'Phone';

export default Phone;