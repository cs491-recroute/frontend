import React, { useState, useRef, forwardRef, useImperativeHandle} from 'react';
import CodeEditor from '../../../CodeEditor';
import { EuiFormRow } from '@elastic/eui';
import classNames from 'classnames';
import styles from './Coding.module.scss';
import { RefProps } from '../../../CodeEditor';
import { RendererProps } from '../constants';
import axios, { AxiosResponse } from 'axios';

const Coding = forwardRef(({ description, editMode, number, _id }: RendererProps, ref) => {
    const editorRef = useRef<RefProps>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [result, setResult] = useState<boolean[] | string>();

    useImperativeHandle(ref, () => ({ answer: editorRef.current?.content }));

    const onRunCode = async (language: number, content: string) => {
        setResult(undefined);
        let runResult: boolean[] | string;
        try {
            const { data: testResults }: AxiosResponse<boolean[]> = await axios.post('/api/executeCode', { language, content, questionID: _id });
            runResult = testResults;
        } catch ({ response: { data }}: any) {
            runResult = data as string;
        }
        setResult(runResult);
    };

    return <EuiFormRow label={`${number}. ${description}`} fullWidth className={classNames({ [styles.fullScreen]: fullScreen, [styles.darkMode]: darkMode })}>
        <CodeEditor 
            ref={editorRef}
            editMode={editMode}
            fullScreen={fullScreen}
            onRunCode={onRunCode}
            onFullScreen={() => setFullScreen(!fullScreen)}
            onDarkModeChange={setDarkMode}
            result={result}
        />
    </EuiFormRow>
});

Coding.displayName = 'Coding';

export default Coding;