import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { translate } from '../../../utils';

type ShortTextProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const ShortText = forwardRef(({ required, title, placeholder, editMode }: ShortTextProps, ref) => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    const triggerError = () => setError(true);

    useImperativeHandle(ref, () => ({ answer, invalid: required && !answer, triggerError }));

    const handleChange = ({ target: { value } }: any) => {
        setError(!!required && !value);
        setAnswer(value);
    };

    return <EuiFormRow 
        label={title} 
        fullWidth 
        isInvalid={error} 
        error={translate('This field is required')}
    >
        <EuiFieldText 
            fullWidth 
            disabled={editMode} 
            required={error} 
            placeholder={placeholder}
            value={answer}
            onChange={handleChange}
            onBlur={handleChange}
        />
    </EuiFormRow>
});

ShortText.displayName = 'ShortText';

export default ShortText;