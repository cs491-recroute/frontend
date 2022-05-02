import React, { Fragment, useCallback, useEffect } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FormBuilder.module.scss';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import { Form } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { useRouterWithReturnBack } from '../../utils/hooks';
import { MAIN_PAGE } from '../../constants';
import { EuiButton, EuiCollapsibleNav, EuiIcon, EuiText } from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
    isRightPanelOpen as isFormBuilderRightPanelOpen,
    toggleRightPanel as toggleFormBuilderRightPanel,
    setCurrentForm,
    getCurrentForm,
    getParentFlowAsync,
    getIsActive
} from '../../redux/slices/formBuilderSlice';

import { wrapper } from '../../redux/store';
import LeftPanel from '../../components/FormBuilder/LeftPanel';
import FormContent from '../../components/FormBuilder/FormContent';
import Header from '../../components/FormBuilder/Header';
import DisabledPage from '../../components/DisabledPage';
import RightPanel from '../../components/FormBuilder/RightPanel';
import { STAGE_TYPE } from '../../types/enums';

// eslint-disable-next-line @typescript-eslint/ban-types
type FormBuilderProps = {}

const FormBuilderPage: NextPage<FormBuilderProps> = () => {
    const { returnAvailable, returnBack } = useRouterWithReturnBack();

    const dispatch = useAppDispatch();
    const form = useAppSelector(getCurrentForm);
    const isActive = useAppSelector(getIsActive);
    const isRightPanelOpen = useAppSelector(isFormBuilderRightPanelOpen);

    const toggleRightPanel = useCallback(status => () => {
        if (status !== isRightPanelOpen) dispatch(toggleFormBuilderRightPanel(status));
    }, [isRightPanelOpen]);

    useEffect(() => {
        if (form.flowID) dispatch(getParentFlowAsync(form.flowID));
    }, [form]);

    return (<Fragment>
        <Head>
            <title>{`${translate('Form Builder')} | ${form.name}`}</title>
        </Head>
        <DisabledPage isActive={isActive}>
            <Header />
            <div className={styles.content}>
                <FormContent form={form} editMode />
            </div>
        </DisabledPage>
        <LeftPanel />

        {returnAvailable &&
            <EuiButton
                className={styles.returnToFlow}
                onClick={() => { returnBack(STAGE_TYPE.FORM) }}
            >
                Return to Flow
            </EuiButton>
        }
        <RightPanel />
    </Fragment>);
};

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        const { formID } = context.query;
        try {
            const { data: form }: AxiosResponse<Form> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/form/${formID}`);
            dispatch(setCurrentForm(form));
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

export default FormBuilderPage;