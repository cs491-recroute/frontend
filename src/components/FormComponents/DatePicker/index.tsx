import { EuiFormRow, EuiDatePicker } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import moment from 'moment';

type DatePickerProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
}

const DatePicker = forwardRef(({ required, title, placeholder, editMode }: DatePickerProps, ref) => {
    const [date, setDate] = useState<moment.Moment | null>(null);
    const [error, setError] = useState({
        isError: false,
        errorMessage: 'This field is required'
    })

    const triggerError = () => setError({ ...error, isError: true });

    useImperativeHandle(ref, () => ({ answer: date?.toString(), invalid: required && !date, triggerError }));

    if (typeof window === 'undefined') {
        // EuiDatePicker is not available in SSR
        return null;
    }
    return <EuiFormRow label={title} isInvalid={error.isError} error={error.errorMessage}>
        <EuiDatePicker 
            fullWidth 
            disabled={editMode} 
            required={error.isError} 
            placeholder={placeholder}
            selected={date}
            onChange={value => { 
                setError({ ...error, isError: false });
                setDate(value);
            }}
        />
    </EuiFormRow>
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;