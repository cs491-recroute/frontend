/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getUser } from '../redux/slices/userSlice';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../styles/Profile.module.scss';
import { useAppSelector } from '../utils/hooks';
import { AxiosResponse } from 'axios';
import { MAIN_PAGE } from '../constants';
import { SERVICES } from '../constants/services';
import { setCurrentUser } from '../redux/slices/userSlice';
import { wrapper } from '../redux/store';
import { User } from '../types/models';
import { gatewayManager } from '../utils/gatewayManager';
import { translate } from '../utils';
import { EuiButton } from '@elastic/eui';

const AdminPanelPage: NextPage = () => {
    const user = useAppSelector(getUser);
    const zoomAuthURL = `https://zoom.us/oauth/authorize` +
        `?response_type=code` +
        `&client_id=8yb9iP2tRtmlxOpw9iAiWg` +
        `&redirect_uri=http%3A%2F%2Flocalhost%3A3500%2Foauth2Callback%2Fzoom` +
        `&state=${user._id}`;

    const zoomLinkClick = () => {
        window.open(zoomAuthURL, "_blank");
    }

    if (user) {
        return (
            <div>
                <h1 className={styles.title1}>{translate('Admin Panel')}</h1>
                <hr />
                {user.company.isLinked ?
                    (<h1>Zoom account is linked</h1>) :
                    (<EuiButton
                        onClick={zoomLinkClick}
                    >
                        Link Zoom Account
                    </EuiButton>)
                }
            </div>
        )
    }
    return null;
};

export default AdminPanelPage;

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        try {
            const { data: user }: AxiosResponse<User> = await gatewayManager.useService(SERVICES.USER).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/user`);
            dispatch(setCurrentUser(user));
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