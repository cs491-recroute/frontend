import React, { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Image from 'next/image';
import { AxiosResponse } from 'axios';
import { Stage, Test } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';
import { wrapper } from '../../redux/store';
import { setHeaderVisible } from '../../redux/slices/globalSlice';
import TestContent from '../../components/TestBuilder/TestContent';
import { STAGE_TYPE } from '../../types/enums';
import { Paper, Button } from '@mui/material';
import styles from '../../styles/StageFillingPage.module.scss';
import { EuiText } from '@elastic/eui';
import { translate } from '../../utils';

type FillingPageProps = {
    stage?: Stage;
    error?: string;
}

const FillingPage: NextPage<FillingPageProps> = ({ stage, error }: FillingPageProps) => {
    const [started, setStarted] = useState(false);
    if (!stage) {
        return <Paper elevation={10} className={styles.container}>
            <Image src='/assets/stage_error.png' width={250} height={250} />
            <EuiText color='danger' style={{ marginTop: 20 }}><h2>{error}</h2></EuiText>
        </Paper>;
    }

    const startTest = () => {
        setStarted(true);
    };

    switch (stage.type) {
        case STAGE_TYPE.TEST: {
            if (!started) {
                return <Paper elevation={10} className={styles.container} >
                    <EuiText textAlign='center'>
                        <span style={{ fontSize: 20 }}>
                            {`${translate('You are about to start solving')} `}
                            <b>{stage.stageProps.name}</b>
                        </span>
                        <br/>
                        <Image src='/assets/start_test.png' width={250} height={250} />
                        <br/>
                        {`${translate('You have {duration} minutes to solve this test.', { duration: stage.testDuration })}`}
                        <br/>
                        {translate('After clicking the below button, you will be redirected to the test page.')}
                        <br/>
                        {translate('If you exit the test page, you will not be able to continue the test.')}
                        <Button 
                            variant='contained' 
                            color='success'
                            fullWidth
                            className={styles.startButton}
                            onClick={startTest}
                        >{translate('Start Test')}</Button>
                    </EuiText>
                </Paper>;
            }
            return <TestContent test={stage.stageProps as Test} duration={stage.testDuration}/>
        }
        default: {
            return null;
        }
    }
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(({ dispatch }) => async (context): Promise<any> => {
    const { applicationIDs } = context.query;
    if (!applicationIDs || !Array.isArray(applicationIDs)) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }
    const [flowID, stageID, applicantID] = applicationIDs;
    // TODO: If applicant filled this stage before, show corresponding warning
    try {
        dispatch(setHeaderVisible(false));
        const { data: stage }: AxiosResponse<Stage> = await gatewayManager.useService(SERVICES.FLOW).get(`/flow/${flowID}/stage/${stageID}`);
        return { props: { stage } };
    } catch ({ response: { data: { message }}}: any) {
        return { props: { error: message } };
    }
});

export default FillingPage;
