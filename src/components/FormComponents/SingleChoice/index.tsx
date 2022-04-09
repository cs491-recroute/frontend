import { EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Option } from '../../../types/models';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { translate } from '../../../utils';

type SingleChoiceProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    options?: Option[];
}

const SingleChoice = forwardRef(({ required, title, editMode, options }: SingleChoiceProps, ref) => {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [error, setError] = useState(false);

    const triggerError = () => setError(true);

    useImperativeHandle(ref, () => ({ answer: selectedOption, invalid: required && !selectedOption, triggerError }));

    return <EuiFormRow 
        label={title}
        fullWidth 
        isInvalid={error}
        error={translate('This field is required')}
    >
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            aria-disabled={editMode}
            aria-required={required}
            name="radio-buttons-group"
            onChange={(e, value) => {
                setSelectedOption(value); 
                setError(false);
            }}
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