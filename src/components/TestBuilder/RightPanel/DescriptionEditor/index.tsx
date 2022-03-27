import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Question } from '../../../../types/models';

const DescriptionEditor = forwardRef<{ value: Question['description']; }, { defaultValue: Question['description']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <EuiFormRow label={translate('Description')}>
            <EuiTextArea 
                defaultValue={defaultValue} 
                value={value} 
                onChange={({ target: { value: changedValue }}) => setValue(changedValue)}
            />
        </EuiFormRow>
    );
});

DescriptionEditor.displayName = 'DescriptionEditor';

export default DescriptionEditor;