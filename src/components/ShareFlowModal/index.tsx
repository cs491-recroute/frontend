import { EuiButton, EuiFieldText, EuiFormRow, EuiModal, EuiModalBody, EuiModalHeader, EuiModalHeaderTitle } from '@elastic/eui';
import axios from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Flow } from '../../types/models';
import { translate, validateEmail } from '../../utils';
import styles from './ShareFlowModal.module.scss';

type ShareFlowModalProps = {
    flow: Flow;
}
export type ShareFlowModalRef = { close: () => void, open: () => void };

const ShareFlowModal = forwardRef<ShareFlowModalRef, ShareFlowModalProps>(({flow}, ref)  => {
    
    const flowURL = (flow.stages[0] && (typeof window !== 'undefined')) ? `${window?.location?.origin}/fill/${flow._id}/${flow.stages[0]._id}` : ''
    const [inviteMail, setInviteMail] = useState('');
    const [isOpen, setOpen] = useState(false);
    const [copyLinkClicked, setCopyLinkClicked] = useState(false);
    const [sendInviteClicked, setSendInviteClicked] = useState({
        finished: false,
        success: false,
        message: ''
    });
    const [error, setError] = useState({
        isError: false,
        errorMessage: 'Invalid input'
    });

    const close = () => {
        setOpen(false);
        setCopyLinkClicked(false);
        setSendInviteClicked({
            finished: false,
            success: false,
            message: ''
        });
    }
    const open = () => {
        setOpen(true);
    }

    useImperativeHandle(ref, () => ({ close, open }));

    const handleSendInvite = async () => {
        if(inviteMail && validateEmail(inviteMail)){
            try {
                const res = await axios.post(`/api/flows/${flow._id}/inviteMail`, {
                    mail: inviteMail
                });
                setSendInviteClicked({
                    finished: true,
                    success: true,
                    message: 'Email was sent successfully'
                });
            } catch ({ response: { data }}: any) {
                setSendInviteClicked({
                    finished: true,
                    success: false,
                    message: data as any
                });
            }
            setTimeout(() => setSendInviteClicked({
                finished: false,
                success: false,
                message: ''
            }), 3000);
            setInviteMail('');
        }else{
            setError({ isError: true, errorMessage: 'Invalid email' });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(flowURL);
        setCopyLinkClicked(true);
        setTimeout(setCopyLinkClicked, 3000);
    }

    const handleChange = ({ target: { value }}: any) => {
        setInviteMail(value);
        if(value && !validateEmail(value)) {
            setError({ isError: true, errorMessage: 'Invalid email' });
        } else {
            setError({ isError: false, errorMessage: '' });
        }
    };

    return isOpen ?
        <EuiModal onClose={close} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>{translate('Share Flow')}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <EuiFormRow label={translate('LINK TO SHARE')} fullWidth>
                    <EuiFieldText icon={'link'} value={flowURL}
                        placeholder="Placeholder text" 
                        disabled={true}
                        fullWidth
                    />
                </EuiFormRow>
                <div className={styles.shareButtons}>
                    <EuiFormRow>  
                        <p className={styles.successFeedbackText}>{copyLinkClicked && translate('Link Copied!')}</p>
                    </EuiFormRow>
                    <EuiFormRow>
                        <EuiButton onClick={handleCopyLink} fill>
                        Copy Link
                        </EuiButton>
                    </EuiFormRow>

                    <EuiFormRow>
                        <EuiButton onClick={() => window.open(flowURL, '_blank')} fill>
                            {translate('Open in New Tab')}
                        </EuiButton>
                    </EuiFormRow>
                </div>
                <EuiFormRow 
                    isInvalid={error.isError}
                    error={error.errorMessage} 
                    label={translate('INVITE BY EMAIL')}  fullWidth
                >
                    <EuiFieldText icon={'email'} value={inviteMail}
                        placeholder="info@recroute.com"
                        fullWidth
                        isInvalid={!!inviteMail && !validateEmail(inviteMail)}
                        onChange={handleChange}
                    />
                </EuiFormRow>
                <div className={styles.shareButtons}>
                    <EuiFormRow>  
                        <p className={sendInviteClicked.success ? styles.successFeedbackText : styles.unsuccessFeedbackText}>{sendInviteClicked.finished && sendInviteClicked.message}</p>
                    </EuiFormRow>
                    <EuiFormRow>  
                        <EuiButton onClick={handleSendInvite} fill>
                        Send Invite
                        </EuiButton>
                    </EuiFormRow>
                </div>
            </EuiModalBody>
        </EuiModal> : null;
});

ShareFlowModal.displayName = 'CreateFlowModal';

export default ShareFlowModal;