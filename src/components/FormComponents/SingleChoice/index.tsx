import { EuiFormRow } from '@elastic/eui';
import React from 'react';
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

const SingleChoice = ({ required, title, editMode, options }: SingleChoiceProps) => {

    return <EuiFormRow label={title} fullWidth>
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            aria-disabled={editMode}
            aria-required={required}
            name="radio-buttons-group"
        >
            {options?.map(option => (
                <FormControlLabel
                    checked={false}
                    id={option._id}
                    key={option.description}
                    control={<Radio />}
                    label={option.description}
                />
            ))}
        </RadioGroup>
    </EuiFormRow>
};

export default SingleChoice;