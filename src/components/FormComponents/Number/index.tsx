import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';

type NumberProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Number = forwardRef(({ required, title, placeholder, editMode }: NumberProps, ref) => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState({
        isError: false,
        errorMessage: 'This field is required'
    });

    const triggerError = () => setError({ ...error, isError: true });

    useImperativeHandle(ref, () => ({ answer, invalid: required && !answer, triggerError }));

    const handleChange = ({ target: { value } }: any) => {
        if(!isNaN(value)){
            setAnswer(value);
            setError({ ...error, isError: !value });
        }
    };

    return <EuiFormRow 
        label={title}
        fullWidth 
        isInvalid={required ? error.isError : false}
        error={required ? error.errorMessage : null}
    >
        <EuiFieldText 
            fullWidth
            disabled={false} 
            required={required} 
            placeholder={placeholder}
            value={answer}
            onChange={handleChange}
            onBlur={handleChange}
        />
    </EuiFormRow>            
});

Number.displayName = 'Number';

export default Number;