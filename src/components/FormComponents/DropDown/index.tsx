import { EuiFormRow, EuiSelect } from '@elastic/eui';
import React from 'react';
import {Option} from '../../../types/models';

type DropDownProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
    options?: Option[];
}

const DropDown = ({ required, title, placeholder, editMode, options}: DropDownProps) => {
    const newArray = options?.map(option => {
        return {
            key: option.key,
            text: option.value
        }; 
    });

    return <EuiFormRow label={title} fullWidth>
        <EuiSelect 
            fullWidth
            options={newArray} 
            disabled={editMode} 
            required={required}
            placeholder={placeholder}
        />
    </EuiFormRow>
};

export default DropDown;