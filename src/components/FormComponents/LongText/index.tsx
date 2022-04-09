import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';

type LongTextProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
}

const LongText = forwardRef(({ required, title, placeholder, editMode }: LongTextProps, ref) => {
    const [answer, setAnswer] = useState('');

    useImperativeHandle(ref, () => ({ answer }));

    return <EuiFormRow label={title} fullWidth>
        <EuiTextArea 
            fullWidth 
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
            resize={editMode ? 'none' : 'vertical'}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
        />
    </EuiFormRow>
});

LongText.displayName = 'LongText';

export default LongText;