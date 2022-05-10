import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { translate } from '../../../../utils';
import { Question } from '../../../../types/models';
import styles from './OptionsEditor.module.scss';
import { Radio, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const OptionsEditor = forwardRef<{ value: Question['options']; }, { defaultValue: Question['options']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    const handleRadioClick = (index: number) => () => {
        if (!value) return;
        const newOptions = [...value];
        newOptions[index] = { ...newOptions[index], isCorrect: !newOptions[index].isCorrect };
        setValue(newOptions);
    };

    const handleDescriptionChange = (index: number) => ({ target: { value: newValue }}: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;
        const newOptions = [...value];
        newOptions[index] = { ...newOptions[index], description: newValue };
        setValue(newOptions);
    };

    const handleNewOption = () => {
        const newOption = {
            description: 'New Option',
            isCorrect: false
        };
        if (!value) {
            setValue([newOption]);
            return;
        }
        setValue([...value, newOption]);
    };

    const handleDeleteOption = (index: number) => {
        if (!value) return;
        const newOptions = [...value];
        newOptions.splice(index, 1);
        setValue(newOptions);
    }

    return (
        <>
            <div className={styles.label}>
                {translate('Options')}
            </div>
            {value?.map((option, index) => (
                <div
                    key={option._id}
                    className={styles.singleOption}
                >
                    <Radio
                        onClickCapture={handleRadioClick(index)}
                        checked={option.isCorrect}
                        size='small'
                        color='success'
                        className={styles.radio}
                    />
                    <input 
                        value={option.description}
                        className={styles.input}
                        onChange={handleDescriptionChange(index)}
                    />
                    <div style={{ flex: 1 }}/>
                    <IconButton size='small' color="error" onClick={() => { handleDeleteOption(index) }}><DeleteForeverIcon /></IconButton>
                </div>
            ))}
            <button className={styles.addButton} onClick={handleNewOption} >{translate('Add Option')}</button>
        </>
    );
});

OptionsEditor.displayName = 'OptionsEditor';

export default OptionsEditor;