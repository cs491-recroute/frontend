import React, { createContext, useState, useRef, ReactNode, FunctionComponent } from 'react';
import { EuiButton, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader } from '@elastic/eui';

type ConfirmationTexts = { approve: string, cancel: string, prompt: ReactNode };

interface ConfirmationContextInterface {
    withConfirmation: (props: {onApprove: (...args: any[]) => void, onCancel?: (...args: any[]) => void, texts: ConfirmationTexts}) => (...args: any[]) => void;
}

const ConfirmationContext = createContext<ConfirmationContextInterface>({
    withConfirmation: () => () => {}
});

export const ConfirmationProvider: FunctionComponent = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmationTexts, setConfirmationTexts] = useState<ConfirmationTexts>({ approve: '', cancel: '', prompt: null });
    const awaitingPrompt = useRef<{ resolve:(value?: unknown) => void, reject: (value?: unknown) => void }>();

    const withConfirmation: ConfirmationContextInterface['withConfirmation'] = ({onApprove, onCancel, texts}) => async (...args) => {
        setConfirmationTexts(texts);
        setIsOpen(true);

        const result = await new Promise((resolve, reject) => {
            awaitingPrompt.current = { resolve, reject };
        });

        if (result) {
            onApprove(...args);
        } else if (onCancel) {
            onCancel(...args);
        }
    }

    const handleApprove = () => {
        awaitingPrompt.current?.resolve(true);
        setIsOpen(false);
    }

    const handleDeny = () => {
        awaitingPrompt.current?.resolve(false);
        setIsOpen(false);
    }

    return <ConfirmationContext.Provider value={{ withConfirmation }}>
        {children}
        {isOpen && <EuiModal onClose={handleDeny} style={{ width: '50vw', maxWidth: '500px' }}>
            <EuiModalHeader/>
            <EuiModalBody>
                {confirmationTexts.prompt}
            </EuiModalBody>
            <EuiModalFooter style={{ justifyContent: 'space-between'}}>
                <EuiButton onClick={handleDeny} fill>
                    {confirmationTexts.cancel}
                </EuiButton>
                <EuiButton onClick={handleApprove} fill>
                    {confirmationTexts.approve}
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>}
    </ConfirmationContext.Provider>
}

export const useWithConfirmation = () => {
    const { withConfirmation } = React.useContext(ConfirmationContext);
    return withConfirmation;
};

export default ConfirmationContext;