import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { translate } from '../../../../utils';
import { Question } from '../../../../types/models';
import styles from './TestCasesEditor.module.scss';
import { TextField } from '@mui/material';

const TestCasesEditor = forwardRef<{ value: Question['testCases']; }, { defaultValue: Question['testCases']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    const handleNewCase = () => {
        const newCase = {
            input: '',
            output: ''
        };
        if (!value) {
            setValue([newCase]);
            return;
        }
        setValue([...value, newCase]);
    };

    const handleTextChange = (index: number, isOutput?: boolean) => ({ target: { value: newValue } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;
        const newCases = [...value];
        newCases[index] = { ...newCases[index], [isOutput ? 'output': 'input']: newValue };
        setValue(newCases);
    };

    return (
        <>
            <div className={styles.label}>
                {translate('Test Cases')}
            </div>
            <div className={styles.sublabel}>
                <span>{translate('Input')}</span>
                <span>{translate('Output')}</span>
            </div>
            {value?.map((testCase, index) => (
                <div key={testCase._id} className={styles.singleCase}>
                    <TextField size='small' fullWidth onChange={handleTextChange(index)}/>
                    <TextField size='small' fullWidth onChange={handleTextChange(index, true)}/>
                </div>
            ))}
            <button className={styles.addButton} onClick={handleNewCase} >{translate('Add New Test Case')}</button>
        </>
    );
});

TestCasesEditor.displayName = 'TestCasesEditor';

export default TestCasesEditor;