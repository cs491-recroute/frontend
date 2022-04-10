import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiFormRow } from '@elastic/eui';
import { translate } from '../../../utils';
import { Question } from '../../../types/models';
import { TextField } from '@mui/material';

const PointsEditor = forwardRef<{ value: Question['points']; }, { defaultValue: Question['points']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState<number | undefined>(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <EuiFormRow label={translate('Points')}>
            <TextField 
                defaultValue={defaultValue} 
                value={value} 
                type='number'
                size='small'
                fullWidth
                onChange={({ target: { value: changedValue }}) => setValue(parseInt(changedValue))}
            />
        </EuiFormRow>
    );
});

PointsEditor.displayName = 'PointsEditor';

export default PointsEditor;