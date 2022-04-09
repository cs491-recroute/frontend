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
    const [error, setError] = useState({
        isError: false,
        errorMessage: 'This field is required'
    });

    const triggerError = () => setError({ ...error, isError: true });

    useImperativeHandle(ref, () => ({ answer, invalid: required && !answer, triggerError }));

    const handleChange = ({ target: { value } }: any) => {
        setAnswer(value);
        setError({ ...error, isError: !value });
    };

    return <EuiFormRow 
        label={title}
        fullWidth 
        isInvalid={error.isError}
        error={error.errorMessage}
    >
        <EuiFieldText 
            fullWidth
            disabled={editMode} 
            required={error.isError} 
            placeholder={placeholder}
            value={answer}
            onChange={handleChange}
            onBlur={handleChange}
        />
    </EuiFormRow>
            
});

Phone.displayName = 'Phone';

export default Phone;