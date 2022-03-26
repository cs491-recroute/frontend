import React, { useState } from 'react';
import { Question } from '../../../types/models';
import { EuiFormRow } from '@elastic/eui';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { RendererProps } from './constants';

const MultipleChoice = ({ description, options, number }: RendererProps) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setSelectedOptions({ ...selectedOptions, [name]: checked });
    };
    return <EuiFormRow label={`${number}. ${description}`} fullWidth>
        <FormGroup>
            {options?.map(({ _id = '', description: optionDesc, isCorrect }) => {
                return <FormControlLabel
                    key={_id}
                    control={<Checkbox checked={selectedOptions[_id]} onChange={handleChange} name={_id} />}
                    label={optionDesc}
                    style={isCorrect ? { backgroundColor: '#1eb71e94' } : {}}
                />
            })}
        </FormGroup>
    </EuiFormRow>
};

export default MultipleChoice;