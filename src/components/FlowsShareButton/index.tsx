import { EuiButtonEmpty } from '@elastic/eui';
import React, { useRef } from 'react';
import { Flow } from '../../types/models';
import ShareFlowModal, { ShareFlowModalRef } from '../ShareFlowModal';

type FlowsShareButtonProps = {
    flow: Flow
};

const FlowsShareButton = ({ flow }: FlowsShareButtonProps) => {
    const shareFlowRef = useRef<ShareFlowModalRef>(null);
    
    return (
        <>
            <EuiButtonEmpty color='text' isDisabled={!flow.stages[0]} isSelected={true}
                onClick={() => shareFlowRef.current?.open()}
            >Share</EuiButtonEmpty>
            <ShareFlowModal flow={flow} ref={shareFlowRef} />
        </>

    );
};

export default FlowsShareButton;