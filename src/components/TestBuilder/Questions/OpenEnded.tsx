import React from 'react';
import { Question } from '../../../types/models';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';

const OpenEnded = ({ description, editMode }: Question & { editMode?: boolean; } ) => {
    return <EuiFormRow label={description} fullWidth>
        <EuiTextArea fullWidth disabled={editMode} resize={editMode ? 'none' : 'vertical'} />
    </EuiFormRow>
};

export default OpenEnded;