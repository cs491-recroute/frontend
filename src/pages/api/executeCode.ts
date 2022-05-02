import { getCodeResult } from './../../utils/lib';
import { Question } from './../../types/models';
import { AxiosResponse } from 'axios';
import { gatewayManager } from './../../utils/gatewayManager';
import { SERVICES } from './../../constants/services';
import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (request, response) => {
    try {
        const { questionID, content, language, testID } = request.body;
        const { data: question }: AxiosResponse<Question> = await gatewayManager.useService(SERVICES.FLOW).get(`/test/${testID}/question/${questionID}`);

        try {
            const testCaseResults = await getCodeResult(language, content, question)
            return response.status(200).send(testCaseResults);
        } catch (error: any) {
            return response.status(400).send(error.message);
        }
    } catch (error) {
        return response.status(400).send('Unknown error');
    }
};

export default handler;