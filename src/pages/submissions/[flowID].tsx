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
    setCurrentFlow,
    getStageCounts,
    setStageFilter,
    resetStageFilter,
    getActiveStageFilter,
    getLoading
} from '../../redux/slices/submissionsSlice';
import { wrapper } from '../../redux/store';
import FlowRenderer from '../../components/FlowRenderer';
import styles from '../../styles/Submissions.module.scss';
import ApplicantTable from '../../components/ApplicantTable';
import { Box, LinearProgress } from '@mui/material';

const SubmissionsPage: NextPage = () => {
    const dispatch = useAppDispatch();
    const activeStageFilter = useAppSelector(getActiveStageFilter);
    const loading = useAppSelector(getLoading);
    const { stages, conditions, name } = useAppSelector(getCurrentFlow);
    const stageCounts = useAppSelector(getStageCounts);

    return (
        <>
            <Head>
                <title>{`${translate('Submissions')} | ${name}`}</title>
            </Head>
            {loading && <Box style={{ position: 'fixed', width: '100%', top: 60 }}>
                <LinearProgress/>
            </Box>}
            <div className={styles.container}>
                <FlowRenderer
                    stages={stages}
                    conditions={conditions}
                    className={styles.flowRenderer}
                    mode='submission'
                    additionalProps={{
                        applicantCounts: stageCounts,
                        setStageFilter: (stageIndex, stageCompleted) => dispatch(setStageFilter({stageIndex, stageCompleted})),
                        resetStageFilter: () => dispatch(resetStageFilter()),
                        activeStageFilter
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
