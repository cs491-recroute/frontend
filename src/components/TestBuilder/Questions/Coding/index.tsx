/* eslint-disable react/prop-types */
import React, { useState, forwardRef, RefObject } from 'react';
import CodeEditor from '../../../CodeEditor';
import { EuiFormRow, EuiText } from '@elastic/eui';
import classNames from 'classnames';
import styles from './Coding.module.scss';
import { RefProps } from '../../../CodeEditor';
import { RendererProps } from '../constants';
import axios, { AxiosResponse } from 'axios';

const Coding = forwardRef(({ description, editMode, number, _id, testID }: RendererProps, ref) => {
    const [fullScreen, setFullScreen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [result, setResult] = useState<boolean[] | string>();

    const onRunCode = async (language: number, content: string) => {
        setResult(undefined);
        let runResult: boolean[] | string;
        try {
            const { data: testResults }: AxiosResponse<boolean[]> = await axios.post('/api/executeCode', { language, content, questionID: _id, testID });
            runResult = testResults;
        } catch ({ response: { data }}: any) {
            runResult = data as string;
        }
        setResult(runResult);
    };

    return <>
        <EuiText size='xs'>
            <pre>
                {`${number}. ${description}`}
            </pre>
        </EuiText>
        <EuiFormRow fullWidth className={classNames({ [styles.fullScreen]: fullScreen, [styles.darkMode]: darkMode })}>
            <CodeEditor 
                ref={ref as RefObject<RefProps>}
                editMode={editMode}
                fullScreen={fullScreen}
                onRunCode={onRunCode}
                onFullScreen={() => setFullScreen(!fullScreen)}
                onDarkModeChange={setDarkMode}
                result={result}
                uniqueID={_id}
            />
        </EuiFormRow>
    </>
});

Coding.displayName = 'Coding';

export default Coding;