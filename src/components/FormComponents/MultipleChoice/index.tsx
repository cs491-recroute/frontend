import { EuiFormRow} from '@elastic/eui';
import React from 'react';
import { Option } from '../../../types/models';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type MultipleChoiceProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    options?: Option[];
}

const MultipleChoice = ({ required, title, editMode, options }: MultipleChoiceProps) => {

    return <EuiFormRow label={title} fullWidth>
        <FormGroup
            aria-labelledby="demo-chackbox-buttons-group-label"
            aria-disabled={editMode}
            aria-required={required}
        >
            {options?.map(option => (
                <FormControlLabel
                    checked={false}
                    key={option.value}
                    id={option._id}
                    control={<Checkbox />} 
                    label={option.value}
                />
            ))}
        </FormGroup>
    </EuiFormRow>
};

export default MultipleChoice;