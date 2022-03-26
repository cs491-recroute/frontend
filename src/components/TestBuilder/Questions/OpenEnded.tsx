import React from 'react';
import { Question } from '../../../types/models';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';
import { RendererProps } from './constants';

const OpenEnded = ({ description, editMode, number }: RendererProps ) => {
    return <EuiFormRow label={`${number}. ${description}`} fullWidth>
        <EuiTextArea fullWidth disabled={editMode} resize={editMode ? 'none' : 'vertical'} />
    </EuiFormRow>
};

export default OpenEnded;