/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import axios, { AxiosResponse } from 'axios';
import { wrapper } from '../../../../../../redux/store';
import { getUser, setCurrentUser } from '../../../../../../redux/slices/userSlice';
import { gatewayManager } from '../../../../../../utils/gatewayManager';
import { SERVICES } from '../../../../../../constants/services';
import { User } from '../../../../../../types/models';
import { MAIN_PAGE } from '../../../../../../constants';
import { useAppSelector } from '../../../../../../utils/hooks';
import { EuiButton, EuiFieldNumber, EuiFieldText, EuiFormRow, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiTextArea } from '@elastic/eui';
import { translate } from '../../../../../../utils';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const GradeInterviewPage: NextPage = () => {
    const user = useAppSelector(getUser);
    const router = useRouter();
    const { applicantID, interviewID, instanceID } = router.query;
    const [applicantEmail, setApplicantEmail] = useState('');
    const [comment, setComment] = useState('');
    const [grade, setGrade] = useState(0 as number);
    const [gradeError, setGradeError] = useState({
        isError: false,
        errorMessage: ''
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: applicant } = await axios.get(`/api/applicant/${applicantID}`);
                setApplicantEmail(applicant.email);
            } catch (error: any) {
                setApplicantEmail('');
            }
        }
        fetchData();

    }, [applicantID]);

    const handleSetGrade = ({ target: { value } }: any) => {
        setGrade(value);
        if (value > 100 || value < 0) {
            setGradeError({
                isError: true,
                errorMessage: 'Please enter a number between 0 and 100'
            });
        } else {
            setGradeError({
                isError: false,
                errorMessage: ''
            });
        }
    }

    const handleSaveButton = async () => {
        if (!gradeError.isError) {
            const body = { notes: comment, grade: +grade }
            try {
                await axios.post(`/api/modal/interview/${interviewID}/${instanceID}/${applicantID}/gradeInterview`, body);
                toast(translate('Successful'), {
                    type: 'success',
                    position: 'bottom-right',
                    hideProgressBar: true
                });
            } catch (error: any) {
                toast(translate(error?.response?.data || 'Error occured!'), {
                    type: 'error',
                    position: 'bottom-right',
                    hideProgressBar: true
                });
            }
        }
    }

    if (user) {
        return (
            <EuiModal onClose={() => { }} initialFocus='.name' style={{ width: '50vw', height: '60vh', maxWidth: '500px' }}>
                <EuiModalHeader>
                    <EuiModalHeaderTitle>{translate('Review Interview')}</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>
                    <EuiFormRow fullWidth label={translate('Applicant Email')}>
                        <EuiFieldText fullWidth value={applicantEmail} disabled={true} />
                    </EuiFormRow>
                    <EuiFormRow fullWidth label={translate('Comment')}>
                        <EuiTextArea
                            fullWidth
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            resize={'vertical'}
                        />
                    </EuiFormRow>

                    <EuiFormRow
                        isInvalid={gradeError.isError}
                        error={gradeError.errorMessage}
                        fullWidth
                        label={translate('Grade')}
                    >
                        <EuiFieldNumber min={0} max={100} value={grade}
                            isInvalid={(grade > 100 || grade < 0)}
                            fullWidth
                            onChange={handleSetGrade}
                        />
                    </EuiFormRow>

                </EuiModalBody>

                <EuiModalFooter>
                    <EuiButton onClick={handleSaveButton} fill>
                        {translate('Save')}
                    </EuiButton>
                </EuiModalFooter>
            </EuiModal>
        )
    }
    return null;
};

export default GradeInterviewPage;

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