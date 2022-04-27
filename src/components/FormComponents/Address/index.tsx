import { EuiFormRow, EuiFieldText } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { translate } from '../../../utils';

type AddressProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const Address = forwardRef(({ required, title, placeholder, editMode }: AddressProps, ref) => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    const triggerError = () => setError(true);

    useImperativeHandle(ref, () => ({ answer, invalid: required && !answer, triggerError }));

    const handleChange = ({ target: { value }}: any) => {
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
            placeholder={placeholder}
            value={answer}
            required={error}
            onChange={handleChange}
            onBlur={handleChange}
        />
    </EuiFormRow>
            
});

Address.displayName = 'Address';

export default Address;