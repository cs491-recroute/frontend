/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0';
import {  getUser, updateUserAsync } from '../redux/slices/userSlice';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../styles/Profile.module.scss';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { AxiosResponse } from 'axios';
import { MAIN_PAGE } from '../constants';
import { SERVICES } from '../constants/services';
import { setCurrentUser } from '../redux/slices/userSlice';
import { wrapper } from '../redux/store';
import { User } from '../types/models';
import { gatewayManager } from '../utils/gatewayManager';
import { EuiButton, EuiFieldText, EuiTitle } from '@elastic/eui';
import { translate, validateEmail } from '../utils';

const ProfilePage: NextPage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    /*let str;
    if(user.profileImage){
        str = Buffer.from(user.profileImage).toString('base64')
    }*/
    
    const [editable, setEditable] = useState(false);
    const [newName, setNewName] = useState(user.name);

    const handleSave = () => {
        const newProps ={
            name: 'name',
            value: newName
        }
        dispatch(updateUserAsync({ newProps, userID: user._id}));
        setEditable(false);
    }

    if (user) {
        return(
            <div>
                <h1 className={styles.title1}>{translate('User Settings')}</h1>
                <hr />
                {editable ?
                    <div>
                        <h1 className={styles.title2}>{translate('User Name :')}</h1>
                        <EuiFieldText
                            className={styles.p}
                            value={newName}
                            onChange={event => setNewName(event.target.value)}
                        >
                        </EuiFieldText>
                        
                        <h1 className={styles.title2}>{translate('Email :')}</h1>
                        <p className={styles.p}>{user.email}</p>
                        
                        <h1 className={styles.title2}>{translate('Company :')}</h1>
                        <p className={styles.p}>{user.company}</p>
                        
                        <h1 className={styles.title2}>{translate('User Roles :')}</h1>
                        {user.roles.length === 0 ? <p className={styles.p}>{translate('No Roles Assigned')}</p>
                            :user.roles.map((role: string) => {
                                <p className={styles.p}>{role}</p>
                            })}

                        <EuiButton className={styles.button} onClick={() => handleSave()}>{translate('Save')}</EuiButton>

                    </div>
                    : <div>
                        <h1 className={styles.title2}>{translate('User Name :')}</h1>
                        <p className={styles.p}>{user.name}</p>
                        
                        <h1 className={styles.title2}>{translate('Email :')}</h1>
                        <p className={styles.p}>{user.email}</p>
                        
                        <h1 className={styles.title2}>{translate('Company :')}</h1>
                        <p className={styles.p}>{user.company}</p>
                        
                        <h1 className={styles.title2}>{translate('User Roles :')}</h1>
                        {user.roles.length === 0 ? <p className={styles.p}>{translate('No Roles Assigned')}</p>
                            :user.roles.map((role: string) => {
                                <p className={styles.p}>{role}</p>
                            })}

                        <EuiButton className={styles.button} onClick={() => setEditable(true)}>{translate('Edit')}</EuiButton>
                    </div>
                }
            </div>
        )
    }
    return null;
};

export default ProfilePage;

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        try {
            const { data: user }: AxiosResponse<User> = await gatewayManager.useService(SERVICES.USER).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/user`);
            dispatch(setCurrentUser(user));
            return { props: {}};
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