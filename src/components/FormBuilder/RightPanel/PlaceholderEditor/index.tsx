import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';

const PlaceholderEditor = forwardRef<{ value: Component['placeholder']; }, { defaultValue: Component['placeholder']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <EuiFormRow label={translate('Placeholder')}>
            <EuiTextArea 
                defaultValue={defaultValue} 
                value={value} 
                onChange={({ target: { value: changedValue }}) => setValue(changedValue)}
            />
        </EuiFormRow>
    );
});

PlaceholderEditor.displayName = 'PlaceholderEditor';

export default PlaceholderEditor;