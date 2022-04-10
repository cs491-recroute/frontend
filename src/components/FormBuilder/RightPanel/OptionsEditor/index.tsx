import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { translate } from '../../../../utils';
import { Component } from '../../../../types/models';
import styles from './OptionsEditor.module.scss';

const OptionsEditor = forwardRef<{ value: Component['options']; }, { defaultValue: Component['options']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    const handleDescriptionChange = (index: number) => ({ target: { value: newValue }}: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;
        const newOptions = [...value];
        newOptions[index] = { ...newOptions[index], description: newValue };
        setValue(newOptions);
    };

    const handleNewOption = () => {
        const newOption = {
            description: 'New Option'
        };
        if (!value) {
            setValue([newOption]);
            return;
        }
        setValue([...value, newOption]);
    };

    return (
        <>
            <div 
                className={styles.label}
                key='OptionsEditor'
            >
                {translate('Options')}
            </div>
            {value?.map((option, index) => (
                <div
                    key={option._id}
                >
                    {index + 1} : 
                    <input 
                        value={option.description}
                        className={styles.input}
                        onChange={handleDescriptionChange(index)}
                    />
                </div>
            ))}
            <button className={styles.addButton} onClick={handleNewOption} >{translate('Add Option')}</button>
        </>
    );
});

OptionsEditor.displayName = 'OptionsEditor';

export default OptionsEditor;