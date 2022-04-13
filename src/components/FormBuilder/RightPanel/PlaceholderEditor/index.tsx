import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './PlaceholderEditor.module.scss';

const PlaceholderEditor = forwardRef<{ value: Component['placeholder']; }, { defaultValue: Component['placeholder']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <div className={styles.label}>
            {translate('Placeholder')}
            <EuiTextArea 
                className={styles.textArea}
                defaultValue={defaultValue} 
                value={value} 
                onChange={({ target: { value: changedValue }}) => setValue(changedValue)}
            />
        </div>
    );
});

PlaceholderEditor.displayName = 'PlaceholderEditor';

export default PlaceholderEditor;