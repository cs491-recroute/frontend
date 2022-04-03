import { languageOptions } from './../../components/CodeEditor/constants';
import { Question } from './../../types/models';
import { AxiosResponse } from 'axios';
import { gatewayManager } from './../../utils/gatewayManager';
import { SERVICES } from './../../constants/services';
import type { NextApiHandler } from 'next';
import axios from 'axios';

const handler: NextApiHandler = async (request, response) => {
    try {
        const { questionID, content, language } = request.body;
        const { data: question }: AxiosResponse<Question> = await gatewayManager.useService(SERVICES.FLOW).get(`/question/${questionID}`);

        const sourceCode = languageOptions.find(option => option.value === language)?.completeTemplate?.replace('{{CONTENT}}', content);
        if (!sourceCode) return response.status(400).send('Invalid source code');
        const base64SourceCode = Buffer.from(sourceCode).toString('base64');

        const inputs = question.testCases?.map(({ input }) => input).join('\n');
        const expectedOutputs = question.testCases?.map(({ output }) => output);
        if (!inputs || !expectedOutputs) return response.status(400).send('Invalid test cases');
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
            return response.status(400).send(Buffer.from(data.compile_output || data.stderr || '', 'base64').toString());
        }
        const outputs = Buffer.from(data.stdout, 'base64').toString().split('\n');

        const testCaseResults = expectedOutputs.map((output, index) => output === outputs[index]);

        return response.status(200).send(testCaseResults);
    } catch (error) {
        return response.status(400).send('Unknown error');
    }
};

export default handler;