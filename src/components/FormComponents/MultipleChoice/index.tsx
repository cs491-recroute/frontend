import { EuiFormRow, EuiCheckboxGroup } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Option } from '../../../types/models';
import { translate } from '../../../utils';

type MultipleChoiceProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    options?: Option[];
}

const MultipleChoice = forwardRef(({ required, title, editMode, options = [] }: MultipleChoiceProps, ref) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>(options.reduce((acc, option) => ({ ...acc, [option._id || '']: false }), {}));
    const [error, setError] = useState(false);

    const triggerError = () => setError(true);

    useImperativeHandle(ref, () => ({ 
        answer: Object.entries(selectedOptions).filter(([, value]) => value).map(([key]) => key),
        invalid: required && Object.values(selectedOptions).every(value => !value),
        triggerError
    }));

    return <EuiFormRow 
        label={title} 
        fullWidth
        isInvalid={error}
        error={translate('This field is required')}
    >
        <EuiCheckboxGroup 
            options={options.map(e => ({ id: e._id || '', label: e.description }))}
            idToSelectedMap={selectedOptions}
            onChange={id => {
                setSelectedOptions({ ...selectedOptions, [id]: !selectedOptions[id] });
                setError(false);
            }}
        />
    </EuiFormRow>
});

MultipleChoice.displayName = 'MultipleChoice';

export default MultipleChoice;