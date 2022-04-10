import { Question } from './../types/models';
import { languageOptions } from './../components/CodeEditor/constants';
import axios from 'axios';

export const getCodeResult = async (language: number, content: string, question: Question) => {
    const sourceCode = languageOptions.find(option => option.value === language)?.completeTemplate?.replace('{{CONTENT}}', content);
    if (!sourceCode) throw new Error('Invalid source code');
    const base64SourceCode = Buffer.from(sourceCode).toString('base64');

    const inputs = question.testCases?.map(({ input }) => input).join('\n');
    const expectedOutputs = question.testCases?.map(({ output }) => output);
    if (!inputs || !expectedOutputs) throw new Error('Invalid test cases');
    const base64Input = Buffer.from(inputs).toString('base64');

    const { data } = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        language_id: language,
        source_code: base64SourceCode,
        stdin: base64Input
    },{
        params: { base64_encoded: true, wait: 'true' },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || ''
        }
    });

    if (!data.stdout) {
        throw new Error(Buffer.from(data.compile_output || data.stderr || '', 'base64').toString());
    }
    const outputs = Buffer.from(data.stdout, 'base64').toString().split('\n');

    return expectedOutputs.map((output, index) => output === outputs[index]);
}