import { EuiButton, EuiFieldText, EuiFormRow, EuiModal, EuiModalBody, EuiModalHeader, EuiModalHeaderTitle } from '@elastic/eui';
import axios from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Flow } from '../../types/models';
import { translate } from '../../utils';
import styles from './ShareFlowModal.module.scss';

type ShareFlowModalProps = {
    flow: Flow;
}
export type ShareFlowModalRef = { close: () => void, open: () => void };

const ShareFlowModal = forwardRef<ShareFlowModalRef, ShareFlowModalProps>(({flow}, ref)  => {
    
    const flowURL = (flow.stages[0] && (typeof window !== 'undefined')) ? `${window?.location?.origin}/fill/${flow._id}/${flow.stages[0]._id}` : ''
    const [inviteMail, setInviteMail] = useState('');
    const [isOpen, setOpen] = useState(false);

    const close = () => setOpen(false);
    const open = () => {
        setOpen(true);
    }

    useImperativeHandle(ref, () => ({ close, open }));

    const handleSendInvite = async () => {
        if(inviteMail){
            try {
                const res = await axios.post(`/api/flows/${flow._id}/inviteMail`, {
                    mail: inviteMail
                });
            } catch ({ response: { data }}: any) {
                const res = data as string;
            }
        }else{
            alert('You should enter an email address');
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
                <div className={styles.shareLinkButtons}>                        
                    <EuiFormRow>
                        <EuiButton onClick={() => {navigator.clipboard.writeText(flowURL);}} fill>
                        Copy Link
                        </EuiButton>
                    </EuiFormRow>

                    <EuiFormRow>
                        <EuiButton onClick={() => window.open(flowURL, '_blank')} fill>
                            {translate('Open in New Tab')}
                        </EuiButton>
                    </EuiFormRow>
                </div>
                <EuiFormRow label={translate('INVITE BY EMAIL')}  fullWidth>
                    <EuiFieldText icon={'email'} value={inviteMail}
                        placeholder="info@recroute.com"
                        fullWidth
                        onChange={event => {setInviteMail(event.target.value)}}
                    />
                </EuiFormRow>
                <EuiFormRow fullWidth>  
                    <EuiButton onClick={handleSendInvite} style={{float: 'right'}} fill>
                        Send Invite
                    </EuiButton>
                </EuiFormRow>
            </EuiModalBody>
        </EuiModal> : null;
});

ShareFlowModal.displayName = 'CreateFlowModal';

export default ShareFlowModal;