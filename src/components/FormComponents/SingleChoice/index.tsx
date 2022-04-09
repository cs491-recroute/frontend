import { EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Option } from '../../../types/models';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

type SingleChoiceProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    options?: Option[];
}

const SingleChoice = forwardRef(({ required, title, editMode, options }: SingleChoiceProps, ref) => {
    const [selectedOption, setSelectedOption] = useState<string>("");

    useImperativeHandle(ref, () => ({ answer: selectedOption }));

    return <EuiFormRow label={title} fullWidth>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            aria-disabled={editMode}
            aria-required={required}
            name="radio-buttons-group"
            onChange={(e, value) => setSelectedOption(value)}
        >
            {options?.map(option => (
                <FormControlLabel
                    checked={option._id === selectedOption}
                    value={option._id}
                    key={option.description}
                    control={<Radio />}
                    label={option.description}
                />
            ))}
        </RadioGroup>
    </EuiFormRow>
});

SingleChoice.displayName = 'SingleChoice';

export default SingleChoice;