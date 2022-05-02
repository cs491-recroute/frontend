import React, { useMemo, useCallback } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EuiCollapsibleNav, EuiText } from '@elastic/eui';
import styles from '../../styles/FlowBuilder.module.scss';
import { Flow, Form, Test } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import Picker from '../../components/Picker';
import {
    addStageAsync,
    getCurrentFlow,
    getLeftPanelStatus,
    getRightPanelStatus,
    setCurrentFlow,
    toggleLeftPanel as toggleFlowBuilderLeftPanel,
    toggleRightPanel as toggleFlowBuilderRightPanel
} from '../../redux/slices/flowBuilderSlice';
import { STAGE_TYPE } from '../../types/enums';
import Main from '../../components/FlowBuilder/Main';
import Header from '../../components/FlowBuilder/Header';
import { wrapper } from '../../redux/store';
import capitalize from 'lodash.capitalize';
import RightPanelContent from '../../components/FlowBuilder/RightPanelContent';
import DisabledPage from '../../components/DisabledPage';

const FlowBuilderPage: NextPage = () => {
    const dispatch = useAppDispatch();
    const { stages, conditions, active, name } = useAppSelector(getCurrentFlow);
    const leftPanelStatus = useAppSelector(getLeftPanelStatus);
    const rightPanelStatus = useAppSelector(getRightPanelStatus);

    const toggleLeftPanel = useCallback((status: STAGE_TYPE | false) => () => {
        if (status !== leftPanelStatus) dispatch(toggleFlowBuilderLeftPanel(status));
    }, [leftPanelStatus]);

    const toggleRightPanel = useCallback(status => () => {
        if (status !== rightPanelStatus) dispatch(toggleFlowBuilderRightPanel(status));
    }, [rightPanelStatus]);

    const handleLeftPanelItemSelect = useCallback(itemID => {
        dispatch(addStageAsync({
            type: leftPanelStatus as NonNullable<STAGE_TYPE>,
            stageID: itemID
        }));
    }, [leftPanelStatus]);

    return (
        <>
            <Head>
                <title>{`${translate('Flow Builder')} | ${name}`}</title>
            </Head>
            <EuiCollapsibleNav
                className={styles.leftPanel}
                isOpen={!!leftPanelStatus}
                onClose={toggleLeftPanel(false)}
                closeButtonPosition="inside"
                ownFocus={false}
            >
                {leftPanelStatus && <>
                    <EuiText className={styles.title}>
                        {translate(`${capitalize(leftPanelStatus)} Templates`)}
                    </EuiText>
                    <hr />
                    <Picker
                        returnBack
                        onSelect={handleLeftPanelItemSelect}
                        itemType={leftPanelStatus as Exclude<STAGE_TYPE, STAGE_TYPE.INTERVIEW>}
                    />)
                </>}
            </EuiCollapsibleNav>
            <EuiCollapsibleNav
                className={styles.rightPanel}
                style={{ top: 120 }}
                isOpen={rightPanelStatus.stageType !== false}
                onClose={toggleRightPanel({ stageType: false, _id: '', stageID: '' })}
                closeButtonPosition="inside"
                ownFocus={false}
                side="right"
            >
                <EuiText className={styles.title}>
                    {translate('Settings')}
                </EuiText>
                <hr />
                <RightPanelContent stageType={rightPanelStatus.stageType} _id={rightPanelStatus._id} />
            </EuiCollapsibleNav>

            <DisabledPage isActive={active}>
                <Header />
                <Main
                    conditions={conditions}
                    stages={stages}
                    className={styles.content}
                />
            </DisabledPage>

        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        const { flowID, returnBack } = context.query;
        try {
            if (returnBack) dispatch(toggleFlowBuilderLeftPanel(returnBack as STAGE_TYPE));
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

export default FlowBuilderPage;
