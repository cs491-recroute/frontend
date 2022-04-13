import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { EuiSwitch } from '@elastic/eui';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './RequiredEditor.module.scss';

const RequiredEditor = forwardRef<{ value: Component['required']; }, { defaultValue: Component['required']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    return (
        <>
            <div className={styles.label}>
                {translate('Required')}
            </div>
            <div className={styles.required}>
                <EuiSwitch
                    label=''
                    checked={value}
                    onChange={e => setValue(!value)}
                />
            </div>
        </>
    );
});

RequiredEditor.displayName = 'RequiredEditor';

export default RequiredEditor;