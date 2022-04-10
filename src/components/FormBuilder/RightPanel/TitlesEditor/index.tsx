import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './TitlesEditor.module.scss';
import { EuiFormRow, EuiTextArea } from '@elastic/eui';

const TitlesEditor = forwardRef<{ value: Component['titles']; }, { defaultValue: Component['titles']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    const handleTitleChange = (index: number, newValue: string) => {
        if (!value) return;
        const newTitles = [...value];
        newTitles[index] = newValue ;
        setValue(newTitles);
    };

    return (
        <>
            <div 
                className={styles.label}
                key='TitlesEditor'
            >
                {translate('Titles')}
            </div>
            {value?.map((title, index) => (
                <div
                    className={styles.label2}
                    key={index}
                >
                    {translate('Title ')} {index + 1} :
                    <EuiFormRow>
                        <EuiTextArea 
                            className={styles.input}
                            value={title} 
                            onChange={({ target: { value: newValue }}) => handleTitleChange(index, newValue)}
                        />
                    </EuiFormRow>
                </div>
            ))}
        </>
    );
});

TitlesEditor.displayName = 'TitlesEditor';

export default TitlesEditor;