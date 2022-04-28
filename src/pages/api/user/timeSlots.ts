import axios from 'axios';
import type { NextApiHandler } from 'next';
import { SERVICES } from '../../../constants/services';
import { gatewayManager } from '../../../utils/gatewayManager';

const checkStageAccess: NextApiHandler = async (request, response) => {
    const { fetchedInterviewers } = request.body;
    try {
        const {data: timeSlots} = await axios.get(`https://recroute.co:3500/user/available/timeSlots`, { params: { userIDs: JSON.stringify(fetchedInterviewers) } });
        return response.status(200).send(timeSlots);
    } catch ({ response: { data: { message }}}: any) {
        return response.status(400).send(message);
    }
};

export default checkStageAccess;