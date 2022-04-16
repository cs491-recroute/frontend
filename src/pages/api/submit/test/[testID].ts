import { getCodeResult } from './../../../../utils/lib';
import { QUESTION_TYPES } from './../../../../types/enums';
import type { NextApiHandler } from 'next';
import { gatewayManager } from '../../../../utils/gatewayManager';
import { SERVICES } from '../../../../constants/services';
import { AxiosResponse } from 'axios';
import { Question } from '../../../../types/models';

const submitTest: NextApiHandler = async (request, response) => {
    const { testID, applicantID } = request.query;
    const answers = request.body;

    const result = {} as { [key: string]: any };
    for (let index = 0; index < answers.length; index++) {
        const { questionID, answer, language } = answers[index];
        const { data: question }: AxiosResponse<Question> = await gatewayManager.useService(SERVICES.FLOW).get(`/question/${questionID}`);
        
        let grade = 0;
        let additionalProps = {};
        switch (question.type) {
            case QUESTION_TYPES.MULTIPLE_CHOICE: {
                const { options } = question;
                if (!options || !options.length) break;
                if (!question.points) break;
                const correctSelections = options.reduce((acc, option) => {
                    const selected = answer.find((e: any) => e === option._id);
                    if (option.isCorrect && selected || !option.isCorrect && !selected) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);
                grade = (correctSelections / options.length) * question.points;
                break;
            }
            case QUESTION_TYPES.CODING: {
                if (!question.testCases) break;
                try {
                    const testCaseResults = await getCodeResult(language, answer, question);
                    if (question.points) {
                        grade = question.testCases!.reduce((acc, testCase, i) => {
                            const isCorrect = testCaseResults[i];
                            if (isCorrect) {
                                return acc + testCase.points;
                            }
                            return acc;
                        }, 0);
                    }
                    additionalProps = {
                        testCaseResults: testCaseResults.map((passed, i) => ({
                            testCaseID: question.testCases![i]._id,
                            passed
                        }))
                    };
                } catch (error: any) {
                    additionalProps = {
                        testCaseResults: question.testCases.map(testCase => ({
                            testCaseID: testCase._id,
                            passed: false
                        }))
                    };
                }
                break;
            }
            default:
        }
        result[questionID] = {
            questionID,
            value: answer,
            grade: Math.floor(grade),
            ...additionalProps
        };
    }
    try {
        await gatewayManager.useService(SERVICES.FLOW).post(`/test/${testID}/submission/${applicantID}`, { questionSubmissions: result });
        response.status(200).send('OK');
    } catch ({ response: { data: { message }}}: any) {
        response.status(400).send(message);
    }
};

export default submitTest;