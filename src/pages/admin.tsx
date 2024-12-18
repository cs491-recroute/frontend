/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getUser } from '../redux/slices/userSlice';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../styles/AdminConsole.module.scss';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import axios, { AxiosResponse } from 'axios';
import { MAIN_PAGE } from '../constants';
import { SERVICES } from '../constants/services';
import { setCurrentUser } from '../redux/slices/userSlice';
import { wrapper } from '../redux/store';
import { User } from '../types/models';
import { gatewayManager } from '../utils/gatewayManager';
import { translate } from '../utils';
import { EuiButton, EuiIcon, EuiSelect } from '@elastic/eui';
import AdminConsolePagination from '../components/AdminConsolePagination/pagination';
import { Paper } from '@mui/material';

const AdminPanelPage: NextPage = () => {
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [resp, setResp] = useState({
        docs: [],
        hasNextPage: false,
        hasPrevPage: false,
        limit: 0,
        nextPage: 0,
        page: 0,
        pagingCounter: 0,
        prevPage: 0,
        totalDocs: 0,
        totalPages: 0
    });
    const rowPerPageOptions = [
        { key: '5', text: '5' },
        { key: '10', text: '10' },
        { key: '15', text: '15' },
        { key: '25', text: '25' }
    ];

    const user = useAppSelector(getUser);
    const zoomAuthURL = `https://zoom.us/oauth/authorize` +
        `?response_type=code` +
        `&client_id=8yb9iP2tRtmlxOpw9iAiWg` +
        `&redirect_uri=http%3A%2F%2Flocalhost%3A3500%2Foauth2Callback%2Fzoom` +
        `&state=${user._id}`;

    const zoomLinkClick = () => {
        window.open(zoomAuthURL, "_blank");
    }

    useEffect(() => {
        const getUsers = async () => {
            const response = await axios.post(`/api/adminConsole/getUsers`, {limitFromUser: limit, pageFromUser: page});
            setResp( response.data );
        }
        getUsers();
    }, [])

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
        getUsersWithUiInfo(newLimit, 1);
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        getUsersWithUiInfo(limit, newPage);
    }
    
    const getUsersWithUiInfo = async (newLimit:number, newPage:number) => {
        const response = await axios.post(`/api/adminConsole/getUsers`, {limitFromUser: newLimit, pageFromUser: newPage});
        setResp( response.data );
        console.log(response.data);
    }
    
    if (user) {
        return (
            <div className={styles.container}>
                <Paper className={styles.card} elevation={4}>
                    <h1 className={styles.title1}>{translate('Admin Panel')}</h1>
                    <hr />
                    <table className={styles.table2}>
                        <tbody>
                            <tr>
                                <td className={styles.tColumn1}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {user.company.isLinked ? (<h1 className={styles.title2}>Zoom account is linked</h1>) : null}
                                                </td>
                                                <td>
                                                    <EuiButton
                                                        onClick={zoomLinkClick}
                                                        disabled={user.company.isLinked}
                                                    >
                                                        Link Zoom Account
                                                    </EuiButton>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h1 className={styles.title2}>Company API Key : 4f0101c5-91aa-49be-aa31-b809a8371502</h1>
                                </td>
                                <td className={styles.tColumn2}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p className={styles.title2}>{translate('Select Rows Per Page :')}</p>
                                                </td>
                                                <td>
                                                    <EuiSelect 
                                                        className={styles.rowSelect}
                                                        placeholder='Rows per Page'
                                                        value={limit}
                                                        options={rowPerPageOptions}
                                                        onChange={e => (handleLimitChange(parseInt(e.target.value)))}
                                                    ></EuiSelect>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {resp.totalDocs !== 0 ?
                        <>
                            <table className={styles.table}>
                                <tbody>
                                    <tr className={styles.tr}>
                                        <td className={styles.tdata}>
                                            <p className={styles.theader}>Name</p>
                                        </td>
                                        <td className={styles.tdata}>
                                            <p className={styles.theader}>Email</p>
                                        </td>
                                        <td className={styles.tdata}>
                                            <p className={styles.theader2}>Role</p>
                                        </td>
                                    </tr>
                                    {resp ? resp.docs.map((specificUser: User) => (
                                        <tr key={specificUser._id} className={styles.tr}>
                                            <td className={styles.tdata}>
                                                <p className={styles.tname}>{specificUser.name}</p>
                                            </td>
                                            <td className={styles.tdata}>
                                                <p className={styles.temail}>{specificUser.email}</p>
                                            </td>
                                            <td className={styles.tdata}>
                                                {specificUser.roles.map(role => (
                                                    <p key={role}>{role}</p>
                                                ))}
                                            </td>
                                        </tr>
                                    )) : null}
                                </tbody>
                            </table> 
                            <div className={styles.pageNumbers}>
                                <AdminConsolePagination
                                    resp={resp}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        </>: null
                    }
                </Paper>
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