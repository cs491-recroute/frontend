import { EuiFormRow, EuiSelect } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Option } from '../../../types/models';
import { translate } from '../../../utils';

type DropDownProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
    options?: Option[];
}

const DropDown = forwardRef(({ required, title, placeholder, editMode, options }: DropDownProps, ref) => {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [error, setError] = useState(false);

    const triggerError = () => setError(true);

    useImperativeHandle(ref, () => ({ answer: selectedOption, invalid: required && !selectedOption, triggerError }));
    
    const handleChange = ({ target: { value }}: any) => {
        setError(!!required && !value);
        setSelectedOption(value);
    };

    const newArray = options?.map(option => {
        return {
            key: option._id,
            text: option.description
        };
    });

    return (
        <div>
            <EuiFormRow 
                label={title}
                fullWidth
                isInvalid={error} 
                error={translate('This field is required')}
            >
                <EuiSelect
                    fullWidth
                    options={newArray}
                    disabled={editMode}
                    required={required}
                    placeholder={placeholder}
                    onChange={handleChange}
                />
            </EuiFormRow>
        </div>
    );
});

DropDown.displayName = 'DropDown';

export default DropDown;