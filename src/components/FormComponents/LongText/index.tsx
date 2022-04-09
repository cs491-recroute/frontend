import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { translate } from '../../../utils';

type LongTextProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const LongText = forwardRef(({ required, title, placeholder, editMode }: LongTextProps, ref) => {
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
        <EuiTextArea 
            fullWidth 
            disabled={editMode} 
            required={error} 
            placeholder={placeholder}
            resize={editMode ? 'none' : 'vertical'}
            value={answer}
            onChange={handleChange}
            onBlur={handleChange}
        />
    </EuiFormRow>
});

LongText.displayName = 'LongText';

export default LongText;