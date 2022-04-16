import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { gatewayManager } from '../../../../utils/gatewayManager';
import { SERVICES } from '../../../../constants/services';
import multer from 'multer';
import FormData from 'form-data';

function runMiddleware(
    req: NextApiRequest & { [key: string]: any },
    res: NextApiResponse,
    fn: (...args: any[]) => void
): Promise<any> {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

const submitForm: NextApiHandler = async (
    request: NextApiRequest & { [key: string]: any },
    response: NextApiResponse
) => {
    const { formID, userIdentifier, withEmail } = request.query;

    try {
        // file upload
        const upload = multer();
        await runMiddleware(request, response, upload.any());

        const body = new FormData();
        if (request.files) {
            for (const file of request.files) {
                body.append(file.fieldname, file.buffer, file.originalname);
            }
        }
        body.append('formData', request.body.formData);

        const contentType = `multipart/form-data; boundary=${body.getBoundary()}`;
        await gatewayManager.useService(SERVICES.FLOW).post(`/form/${formID}/submission/${userIdentifier}`,
            body, { headers: { 'content-type': contentType }, params: { withEmail } });
        response.status(200).send('OK');
    } catch ({ response: { data: { message } } }: any) {
        response.status(400).send(message);
    }
};

export default submitForm;
export const config = {
    api: {
        bodyParser: false // Disallow body parsing, consume as stream
    }
};