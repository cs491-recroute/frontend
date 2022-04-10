import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { translate } from '../../../../utils';
import { Question } from '../../../../types/models';
import styles from './TestCasesEditor.module.scss';
import { TextField, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const TestCasesEditor = forwardRef<{ value: Question['testCases']; }, { defaultValue: Question['testCases']; }>(({ defaultValue }, ref) => {
    const [value, setValue] = useState(defaultValue);

    useImperativeHandle(ref, () => ({ value }));

    const handleNewCase = () => {
        const newCase = {
            input: '',
            output: '',
            points: 0
        };
        if (!value) {
            setValue([newCase]);
            return;
        }
        setValue([...value, newCase]);
    };

    const handleTextChange = (index: number, type: string) => ({ target: { value: newValue } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;
        const newCases = [...value];
        let parsedValue: string | number = newValue;
        if (type === 'points') parsedValue = parseInt(newValue || '0', 10);
        newCases[index] = { ...newCases[index], [type]: parsedValue };
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
                <span>{translate('Points')}</span>
            </div>
            {value?.map((testCase, index) => (
                <div key={testCase._id} className={styles.singleCase}>
                    <TextField 
                        size='small'
                        fullWidth 
                        onChange={handleTextChange(index, 'input')}
                        value={testCase.input}
                    />
                    <TextField 
                        size='small' 
                        fullWidth 
                        onChange={handleTextChange(index, 'output')}
                        value={testCase.output}
                    />
                    <TextField 
                        size='small' 
                        className={styles.pointInput} 
                        onChange={handleTextChange(index, 'points')}
                        value={testCase.points}
                        type='tel'
                    />
                    <IconButton size='small' color="error"><DeleteForeverIcon/></IconButton>
                </div>
            ))}
            <button className={styles.addButton} onClick={handleNewCase} >{translate('Add New Test Case')}</button>
        </>
    );
});

TestCasesEditor.displayName = 'TestCasesEditor';

export default TestCasesEditor;