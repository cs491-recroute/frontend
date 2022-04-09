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
    const [date, setDate] = useState<moment.Moment | null>(moment());

    useImperativeHandle(ref, () => ({ answer: date?.toString() }));

    if (typeof window === 'undefined') {
        // EuiDatePicker is not available in SSR
        return null;
    }
    return <EuiFormRow label={title}>
        <EuiDatePicker 
            fullWidth 
            disabled={editMode} 
            required={required} 
            placeholder={placeholder}
            selected={date}
            onChange={value => setDate(value)}
        />
    </EuiFormRow>
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;