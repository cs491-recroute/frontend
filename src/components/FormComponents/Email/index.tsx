import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { validateEmail } from '../../../utils';

type EmailProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Email = forwardRef(({ required, title, placeholder, editMode }: EmailProps, ref) => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState({
        isError: false,
        errorMessage: 'This field is required'
    });

    const triggerError = () => setError({ ...error, isError: true });

    useImperativeHandle(ref, () => ({ answer, invalid: required ? !validateEmail(answer) : (!!answer && !validateEmail(answer)), triggerError }));

    const handleChange = ({ target: { value }}: any) => {
        setAnswer(value);
        if (!value) {
            setError({ isError: !!required, errorMessage: 'This field is required' });
        } else if (!validateEmail(value)) {
            setError({ isError: true, errorMessage: 'Invalid email' });
        } else {
            setError({ isError: false, errorMessage: '' });
        }
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
            isInvalid={!!answer && !validateEmail(answer)}
            placeholder={placeholder}
            value={answer}
            onChange={handleChange}
            onBlur={handleChange}
        />
    </EuiFormRow>
            
});

Email.displayName = 'Email';

export default Email;