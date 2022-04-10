import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './PlaceholdersEditor.module.scss';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';

const PlaceholdersEditor = forwardRef<{ value: Component['placeholders']; }, { defaultValue: Component['placeholders']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    const handlePlaceholderChange = (index: number, newValue: string) => {
        if (!value) return;
        const newPlaceholders = [...value];
        newPlaceholders[index] = newValue ;
        setValue(newPlaceholders);
    };

    return (
        <>
            <div 
                className={styles.label}
                key='PlaceholdersEditor'
            >
                {translate('Placeholders')}
            </div>
            {value?.map((placeholder, index) => (
                <div
                    className={styles.label2}
                    key={index}
                >
                    {translate('Placeholder ')} {index + 1} :
                    <EuiFormRow>
                        <EuiTextArea
                            className={styles.input}
                            defaultValue={placeholder} 
                            onChange={({ target: { value: newValue }}) => handlePlaceholderChange(index, newValue)}
                        />
                    </EuiFormRow>
                </div>
            ))}
        </>
    );
});

PlaceholdersEditor.displayName = 'PlaceholdersEditor';

export default PlaceholdersEditor;