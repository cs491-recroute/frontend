import React, { useCallback, useEffect } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { AxiosResponse } from 'axios';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EuiCollapsibleNav, EuiText, EuiButton } from '@elastic/eui';
import styles from '../../styles/TestBuilder.module.scss';
import { Test } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import TestContent from '../../components/TestBuilder/TestContent';
import { useRouterWithReturnBack } from '../../utils/hooks';
import { setCurrentTest, getCurrentTest } from '../../redux/slices/testBuilderSlice';
import Header from '../../components/TestBuilder/Header';
import { wrapper } from '../../redux/store';
import LeftPanel from '../../components/TestBuilder/LeftPanel';

const TestBuilderPage: NextPage = () => {
    const { returnAvailable, returnBack } = useRouterWithReturnBack();
    const test = useAppSelector(getCurrentTest);

    return (
        <>
            <LeftPanel />
            <Header />
            <div className={styles.content}>
                <TestContent test={test} editMode />
            </div>
            {returnAvailable && 
            <EuiButton
                className={styles.returnToFlow} 
                onClick={returnBack}
            >
                Return to Flow
            </EuiButton>
            }
        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        const { testID } = context.query;
        try {
            const { data: test }: AxiosResponse<Test> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/test/${testID}`);
            dispatch(setCurrentTest(test));
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

export default TestBuilderPage;
