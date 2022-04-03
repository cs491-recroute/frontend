import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import styles from './CodeEditor.module.scss';
import { EditorView, EditorState, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import DarkModeSwitch from './DarkModeSwitch';
import { Select, MenuItem, InputLabel } from '@mui/material';
import { translate } from '../../utils';
import { languageOptions } from './constants';
import { EuiButton } from '@elastic/eui';
import classNames from 'classnames';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { IconButton } from '@mui/material';
import { v4 } from 'uuid';
import RunResult from './RunResult';

type CodeEditorProps = {
    onRunCode: (language: number, content: string) => void;
    editMode?: boolean;
    onFullScreen: () => void;
    fullScreen?: boolean;
    onDarkModeChange: (darkMode: boolean) => void;
    result?: boolean[] | string;
}

export type RefProps = { content?: string };

const CodeEditor = forwardRef<RefProps, CodeEditorProps>(({ onRunCode, editMode, onFullScreen, fullScreen, onDarkModeChange, result }, ref) => {
    const id = useRef(v4());
    const editorRef = useRef<EditorView>();
    const [isDarkTheme, setDarkTheme] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(63);

    const getCurrentContent = () => editorRef?.current?.state.doc.toString() || '';

    useImperativeHandle(ref, () => ({
        content: getCurrentContent()
    }))

    const initializeEditor = (content?: string) => {
        if (editorRef.current) editorRef.current.destroy();
        const { extension = javascript, defaultCode } = languageOptions.find(language => language.value === currentLanguage) || {};
        const editor = new EditorView({
            state: EditorState.create({
                doc: content || defaultCode,
                extensions: [
                    basicSetup, 
                    extension(),
                    ...(isDarkTheme ? [oneDarkTheme] : [])
                ]
            }),
            parent: document.getElementById(id.current) || document.body
        });
        editorRef.current = editor;
        return editor;
    };

    useEffect(() => {
        const editor = initializeEditor(getCurrentContent());
        return () => editor.destroy();
    }, [isDarkTheme]);

    useEffect(() => {
        const editor = initializeEditor();
        return () => editor.destroy();
    }, [currentLanguage]);

    const handleRunCode = () => {
        onRunCode(currentLanguage, getCurrentContent());
    }
    return (
        <div className={classNames(styles.container, { [styles.darkMode]: isDarkTheme })}>
            <div className={styles.options}>
                <InputLabel id='language-label'>{translate('Language')}</InputLabel>
                <Select
                    labelId='language-label'
                    value={currentLanguage}
                    onChange={({ target: { value }}) => setCurrentLanguage(value as number)}
                    className={styles.languageSelect}
                >
                    {languageOptions.map(({ value, text }) => <MenuItem key={value} value={value}>{text}</MenuItem>)}
                </Select>
                <div style={{ flex: 1 }}/>
                <DarkModeSwitch 
                    checked={isDarkTheme}
                    onChange={({ target: { checked }}) => {
                        setDarkTheme(checked);
                        onDarkModeChange(checked);
                    }}
                />
                <IconButton onClick={onFullScreen}>
                    <FullscreenIcon/>
                </IconButton>
            </div>
            <div id={id.current} className={classNames(styles.editor, { [styles.editMode]: editMode, [styles.fullScreen]: fullScreen })} />
            <div className={styles.footer}>
                <EuiButton onClick={handleRunCode} className={styles.runButton} disabled={editMode}>{translate('Run Code')}</EuiButton>
                <RunResult result={result} />
            </div>
        </div>
    )
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;