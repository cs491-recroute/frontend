import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiFormRow, EuiSwitch } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';

const RequiredEditor = forwardRef<{ value: Component['required']; }, { defaultValue: Component['required']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <EuiFormRow label={translate('Required')}>
            <EuiSwitch
                label={value ? "This component is required in this form": "This component is not required in this form"}
                checked={value}
                onChange={e => setValue(!value)}
            />
        </EuiFormRow>
    );
});

RequiredEditor.displayName = 'RequiredEditor';

export default RequiredEditor;