import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Question } from '../../../../types/models';

const NameEditor = forwardRef<{ value: Question['name']; }, { defaultValue: Question['name']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <EuiFormRow label={translate('Name')}>
            <EuiTextArea
                resize='none'
                rows={1}
                defaultValue={defaultValue}
                value={value}
                onChange={({ target: { value: changedValue } }) => setValue(changedValue)}
            />
        </EuiFormRow>
    );
});

NameEditor.displayName = 'NameEditor';

export default NameEditor;