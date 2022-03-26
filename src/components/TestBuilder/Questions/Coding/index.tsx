import React, { useState, useRef } from 'react';
import CodeEditor from '../../../CodeEditor';
import { Question } from '../../../../types/models';
import { EuiFormRow } from '@elastic/eui';
import classNames from 'classnames';
import styles from './Coding.module.scss';
import { RefProps } from '../../../CodeEditor';
import { RendererProps } from '../constants';

const Coding = ({ description, editMode, number }: RendererProps ) => {
    const editorRef = useRef<RefProps>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    return <EuiFormRow label={`${number}. ${description}`} fullWidth className={classNames({ [styles.fullScreen]: fullScreen, [styles.darkMode]: darkMode })}>
        <CodeEditor 
            ref={editorRef}
            editMode={editMode} 
            fullScreen={fullScreen}
            onRunCode={(language, content) => console.log({language, content})}
            onFullScreen={() => setFullScreen(!fullScreen)} 
            onDarkModeChange={setDarkMode}
        />
    </EuiFormRow>
};

export default Coding;