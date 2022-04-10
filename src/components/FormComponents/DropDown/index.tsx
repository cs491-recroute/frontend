import { EuiFormRow, EuiSelect } from '@elastic/eui';
import React from 'react';
import { Option } from '../../../types/models';

type DropDownProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
    options?: Option[];
}

const DropDown = ({ required, title, placeholder, editMode, options }: DropDownProps) => {
    const newArray = options?.map(option => {
        return {
            key: option._id,
            text: option.description
        };
    });

    return (
        <div>
            <EuiFormRow label={title} fullWidth>
                <EuiSelect
                    fullWidth
                    options={newArray}
                    disabled={editMode}
                    required={required}
                    placeholder={placeholder}
                />
            </EuiFormRow>
        </div>
    );
};

export default DropDown;