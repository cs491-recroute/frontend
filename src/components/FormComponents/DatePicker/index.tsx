import { EuiFormRow, EuiDatePicker } from '@elastic/eui';
import React from 'react';

type DatePickerProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
}

const DatePicker = ({ required, title, placeholder, editMode }: DatePickerProps) => {
    return <EuiFormRow label={title}>
        <EuiDatePicker 
            fullWidth 
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
        />
    </EuiFormRow>
};

export default DatePicker;