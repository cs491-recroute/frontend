import { EuiModal, EuiModalBody, EuiModalHeader, EuiModalHeaderTitle } from '@elastic/eui';
import React, { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Question } from '../../types/models';
import { translate } from '../../utils';
import { QUESTION_MAPPINGS } from '../TestBuilder/Questions/constants';
import styles from './PreviewQuestionModal.module.scss';

type PreviewQuestionModalProps = {
    question: Question;
}
export type PreviewQuestionModalRef = { close: () => void, open: () => void };

const PreviewQuestionModal = forwardRef<PreviewQuestionModalRef, PreviewQuestionModalProps>(({question}, ref)  => {
    
    const [isOpen, setOpen] = useState(false);
    const { Renderer } = QUESTION_MAPPINGS[question.type];
    const newRef = createRef<{ answer: any; }>();

    const close = () => {
        setOpen(false);
    }
    const open = () => {
        setOpen(true);
    }

    useImperativeHandle(ref, () => ({ close, open }));

    return isOpen ?
        <EuiModal onClose={close} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>{translate('Preview Question')}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <div  key={question._id} >
                    <Renderer 
                        {...question}
                        ref={newRef}
                        editMode
                        number={1}
                    />
                </div>
            </EuiModalBody>
        </EuiModal> : null;
});

PreviewQuestionModal.displayName = 'PreviewQuestionModal';

export default PreviewQuestionModal;