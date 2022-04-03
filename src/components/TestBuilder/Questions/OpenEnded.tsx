import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import { RendererProps } from './constants';

const OpenEnded = forwardRef(({ description, editMode, number }: RendererProps, ref) => {
    const [answer, setAnswer] = useState('');

    useImperativeHandle(ref, () => ({ answer }))

    return <EuiFormRow label={`${number}. ${description}`} fullWidth>
        <EuiTextArea 
            fullWidth 
            disabled={editMode} 
            resize={editMode ? 'none' : 'vertical'} 
            value={answer}
            onChange={({ target: { value } }) => setAnswer(value)}
        />
    </EuiFormRow>
});

OpenEnded.displayName = 'OpenEnded';

export default OpenEnded;