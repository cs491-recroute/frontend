import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './TitleEditor.module.scss';

const TitleEditor = forwardRef<{ value: Component['title']; }, { defaultValue: Component['title']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <div className={styles.label}>
            {translate('Title')}
            <EuiTextArea 
                className={styles.textArea}
                defaultValue={defaultValue} 
                value={value} 
                onChange={({ target: { value: changedValue }}) => setValue(changedValue)}
            />
        </div>
    );
});

TitleEditor.displayName = 'TitleEditor';

export default TitleEditor;