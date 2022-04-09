import { EuiFormRow, EuiCheckboxGroup } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Option } from '../../../types/models';

type MultipleChoiceProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    options?: Option[];
}

const MultipleChoice = forwardRef(({ required, title, editMode, options = [] }: MultipleChoiceProps, ref) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>(options.reduce((acc, option) => ({ ...acc, [option._id || '']: false }), {}));

    useImperativeHandle(ref, () => ({ answer: Object.entries(selectedOptions).filter(([, value]) => value).map(([key]) => key) }));

    return <EuiFormRow label={title} fullWidth>
        <EuiCheckboxGroup 
            options={options.map(e => ({ id: e._id || '', label: e.description }))}
            idToSelectedMap={selectedOptions}
            onChange={id => setSelectedOptions({ ...selectedOptions, [id]: !selectedOptions[id] })}
        />
    </EuiFormRow>
});

MultipleChoice.displayName = 'MultipleChoice';

export default MultipleChoice;