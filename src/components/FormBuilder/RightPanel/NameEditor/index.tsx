import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './NameEditor.module.scss';

const NameEditor = forwardRef<{ value: Component['name']; }, { defaultValue: Component['name']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <div className={styles.label}>
            {translate('Name')}
            <p
                className={styles.textArea}
                defaultValue={defaultValue}
            >{value}</p>
        </div>
    );
});

NameEditor.displayName = 'NameEditor';

export default NameEditor;