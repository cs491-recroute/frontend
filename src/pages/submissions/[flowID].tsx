import React, { useMemo, useCallback } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Flow, Form, Test } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
    getCurrentFlow,
    setCurrentFlow
} from '../../redux/slices/submissionsSlice';
import { wrapper } from '../../redux/store';
import FlowRenderer from '../../components/FlowRenderer';
import styles from '../../styles/Submissions.module.scss';
import ApplicantTable from '../../components/ApplicantTable';

const SubmissionsPage: NextPage = () => {
    const dispatch = useAppDispatch();
    const { stages, conditions, name } = useAppSelector(getCurrentFlow);

    return (
        <>
            <Head>
                <title>{`${translate('Submissions')} | ${name}`}</title>
            </Head>
            <div className={styles.container}>
                <FlowRenderer
                    stages={stages}
                    conditions={conditions}
                    className={styles.flowRenderer}
                    mode='submission'
                    additionalProps={{
                        applicantCounts: [{
                            stageIndex: 0,
                            completed: false,
                            count: 5
                        },
                        {
                            stageIndex: 0,
                            completed: true,
                            count: 3
                        },
                        {
                            stageIndex: 1,
                            completed: true,
                            count: 1
                        }
                        ]
                    }}
                />
                <ApplicantTable />
            </div>
        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        const { flowID } = context.query;
        try {
            const { data: flow }: AxiosResponse<Flow> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/flow/${flowID}`);
            dispatch(setCurrentFlow(flow));
            return { props: {} };
        } catch (error) {
            return {
                redirect: {
                    permanent: false,
                    destination: MAIN_PAGE
                }
            };
        }
    })
});

export default SubmissionsPage;
