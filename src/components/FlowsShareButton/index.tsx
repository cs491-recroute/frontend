import { EuiButtonEmpty } from '@elastic/eui';
import React, { useRef } from 'react';
import { Flow } from '../../types/models';
import { translate } from '../../utils';
import ShareFlowModal, { ShareFlowModalRef } from '../ShareFlowModal';

type FlowsShareButtonProps = {
    flow: Flow
};

const FlowsShareButton = ({ flow }: FlowsShareButtonProps) => {
    const shareFlowRef = useRef<ShareFlowModalRef>(null);
    const isDisabled = !flow.stages[0] || !flow.active
    
    return (
        <>
            <EuiButtonEmpty style={{color: isDisabled ? 'disabled' : 'black'}} isDisabled={isDisabled} isSelected={true}
                onClick={() => shareFlowRef.current?.open()}
            >{translate('Share')}</EuiButtonEmpty>
            <ShareFlowModal flow={flow} ref={shareFlowRef} />
        </>

    );
};

export default FlowsShareButton;