import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';

const TitleEditor = forwardRef<{ value: Component['title']; }, { defaultValue: Component['title']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <EuiFormRow label={translate('Title')}>
            <EuiTextArea 
                defaultValue={defaultValue} 
                value={value} 
                onChange={({ target: { value: changedValue }}) => setValue(changedValue)}
            />
        </EuiFormRow>
    );
});

TitleEditor.displayName = 'TitleEditor';

export default TitleEditor;