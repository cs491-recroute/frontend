import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';

type EmailProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Email = forwardRef(({ required, title, placeholder, editMode }: EmailProps, ref) => {
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

Email.displayName = 'Email';

export default Email;