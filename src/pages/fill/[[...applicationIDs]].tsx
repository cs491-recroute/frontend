import React, { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Image from 'next/image';
import axios, { AxiosResponse } from 'axios';
import { Stage, Test, Form } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';
import { wrapper } from '../../redux/store';
import { setHeaderVisible } from '../../redux/slices/globalSlice';
import TestContent from '../../components/TestBuilder/TestContent';
import { STAGE_TYPE } from '../../types/enums';
import { Paper, Button } from '@mui/material';
import styles from '../../styles/StageFillingPage.module.scss';
import { EuiText, EuiFieldText } from '@elastic/eui';
import Head from 'next/head';
import { translate } from '../../utils';
import FormContent from '../../components/FormBuilder/FormContent';
import { useRouter } from 'next/router';
import { validateEmail } from '../../utils';

type FillingPageProps = {
    stage?: Stage;
    error?: string;
    flowName?: string;
    requestMail?: boolean;
    prefilledEmail?: string;
}

const FillingPage: NextPage<FillingPageProps> = ({ stage, error, flowName, requestMail, prefilledEmail }: FillingPageProps) => {
    const router = useRouter();
    const { applicationIDs } = router.query;
    const [flowID, stageID, applicantID] = applicationIDs as string[];

    const HeadTitle = flowName ? <Head>
        <title>{flowName}</title>
    </Head> : null;
    const [started, setStarted] = useState(false);
    const [email, setEmail] = useState(prefilledEmail || '');
    const [errorText, setError] = useState('');
    if (!stage) {
        return <Paper elevation={10} className={styles.container}>
            {HeadTitle}
            <Image src='/assets/stage_error.png' width={250} height={250} />
            <EuiText color='danger' style={{ marginTop: 20 }}><h2 style={{ textAlign: 'center' }}>{error}</h2></EuiText>
        </Paper>;
    }

    const startTest = async () => {
        try {
            await axios.post('/api/startTest', { testID: stage.stageID, applicantID });
            window.onbeforeunload = () => '';
            setStarted(true);
        } catch ({ response: { data }}: any) {
            setError(data as any);
        }
    };

    const startForm = async () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            await axios.post('/api/checkStageAccess', {
                flowID,
                stageID,
                userIdentifier: email,
                withEmail: true
            });
            setStarted(true);
        } catch ({ response: { data }}: any) {
            setError(data as any);
        }
    }

    switch (stage.type) {
        case STAGE_TYPE.TEST: {
            if (!started) {
                return <Paper elevation={10} className={styles.container} >
                    {HeadTitle}
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
                        <div className={styles.errorText} >{errorText}</div>
                    </EuiText>
                </Paper>;
            }
            return <>
                {HeadTitle}
                <TestContent test={stage.stageProps as Test} duration={stage.testDuration} userIdentifier={applicantID} />
            </>
        }
        case STAGE_TYPE.FORM: {
            if (!started && requestMail && !prefilledEmail) {
                return <Paper elevation={10} className={styles.container} >
                    {HeadTitle}
                    <EuiText textAlign='center'>
                        <span style={{ fontSize: 20 }}>
                            {`${translate('You are about to apply for job advert')} `}
                            <br/>
                            <b>{flowName}</b>
                        </span>
                        <br/>
                        <div style={{ margin: '20px 0'}}>
                            {translate('Before starting, we need your email address to communicate through the application process.')}
                        </div>
                        <EuiFieldText 
                            fullWidth
                            placeholder={translate('Please enter your email')}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && startForm()}
                        />
                        <Button 
                            variant='contained' 
                            color='success'
                            fullWidth
                            className={styles.startButton}
                            onClick={startForm}
                        >{translate('Start Filling')}</Button>
                        <div className={styles.errorText} >{errorText}</div>
                    </EuiText>
                </Paper>;
            }
            return <>
                {HeadTitle}
                <FormContent 
                    form={stage.stageProps as Form} 
                    editMode={false} 
                    userIdentifier={email || applicantID} 
                    withEmail={!!email} 
                />
            </>
        }
        default: {
            return null;
        }
    }
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(({ dispatch }) => async (context): Promise<any> => {
    const { applicationIDs, email } = context.query;
    if (!applicationIDs || !Array.isArray(applicationIDs)) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }
    const [flowID, stageID, applicantID] = applicationIDs;
    let stage, flowName;
    try {
        dispatch(setHeaderVisible(false));
        const { data }: AxiosResponse<{ stage: Stage, flowName: string }> = await gatewayManager.useService(SERVICES.FLOW).get(`/flow/${flowID}/stage/${stageID}`);
        stage = data.stage;
        flowName = data.flowName;
    } catch ({ response: { data: { message, flowName: _flowName }}}: any) {
        return { props: { error: message, flowName: _flowName } };
    }

    if (applicantID) {
        try {
            await gatewayManager.useService(SERVICES.FLOW).get(`/${flowID}/${stageID}/${applicantID}/access`);
            return { props: { stage, flowName } };
        } catch ({ response: { data: { message }}}: any) {
            return { props: { error: message, flowName } };
        }
    } else {
        if (stage.type === STAGE_TYPE.TEST) {       
            return { props: { error: 'You don\'t have permission to view this stage', flowName }}
        } else if (stage.type === STAGE_TYPE.FORM) {
            const queryEmail = email?.toString();

            if (queryEmail) {
                try {
                    await gatewayManager.useService(SERVICES.FLOW).get(`/${flowID}/${stageID}/${queryEmail}/access`, { params: { withEmail: true }});
                    return { props: { stage, flowName, requestMail: true, prefilledEmail: queryEmail } };
                } catch ({ response: { data: { message }}}: any) {
                    return { props: { error: message, flowName } };
                }
            }
            return { props: { stage, flowName, requestMail: true }};
        }
    }
});

export default FillingPage;
