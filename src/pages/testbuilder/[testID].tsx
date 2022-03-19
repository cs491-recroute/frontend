import React, { useCallback } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { AxiosResponse } from 'axios';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EuiCollapsibleNav, EuiText } from '@elastic/eui';
import styles from '../../styles/TestBuilder.module.scss';
import { Test } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import TestContent from '../../components/TestBuilder/TestContent';
import {
    addQuestionAsync,
    getLeftPanelStatus,
    setCurrentTest,
    toggleLeftPanel as toggleTestBuilderLeftPanel,
    getCurrentTest
} from '../../redux/slices/testBuilderSlice';
import Header from '../../components/TestBuilder/Header';
import { wrapper } from '../../redux/store';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TestBuilderPage: NextPage = () => {
    const dispatch = useAppDispatch();
    const test = useAppSelector(getCurrentTest);
    const isLeftPanelOpen = useAppSelector(getLeftPanelStatus);

    const toggleLeftPanel = useCallback((status: boolean) => () => {
        if (status !== isLeftPanelOpen) dispatch(toggleTestBuilderLeftPanel(status));
    }, [isLeftPanelOpen]);

    return (
        <>
            <EuiCollapsibleNav
                className={styles.leftPanel}
                isOpen={isLeftPanelOpen}
                onClose={toggleLeftPanel(false)}
                closeButtonPosition="inside"
                ownFocus={false}
            >
                {isLeftPanelOpen && <>                
                    <EuiText className={styles.title}>
                        {translate('Questions')}
                    </EuiText>
                    <hr />
                </>}
            </EuiCollapsibleNav>
            <Button 
                variant='contained' 
                style={{ 
                    borderTopLeftRadius: 0, 
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                    position: 'absolute'
                }}
                className={styles.leftPanelButton}
                startIcon={<AddCircleOutlineIcon/>}
                onClick={toggleLeftPanel(true)}
            >{translate('Add Question')}</Button>
            <Header />
            <TestContent test={test} editMode />
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
