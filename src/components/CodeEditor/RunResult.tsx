import React from 'react';
import { EuiButton, EuiText, EuiPopover } from '@elastic/eui';
import { translate } from '../../utils';

type Props = {
    result?: boolean[] | string;
}

const RunResult = ({ result }: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    if (!result) return null;

    const showMoreButton = (
        <EuiButton color='danger' size='s' onClick={() => setIsOpen(!isOpen)}>
            {translate('Show Details')}
        </EuiButton>
    )

    if (Array.isArray(result)) {
        const correctAnswer = result.every(answer => answer);

        if (correctAnswer) {
            return (
                <EuiText color='success'>
                    <h3 style={{ display: 'inline' }}>
                        {translate('Correct Answer')}
                    </h3>
                    {' '}
                    {translate(`All {count} tests passed`, { count: result.length })}
                </EuiText>
            )
        }

        return <EuiText color={'danger'}>
            <h3 style={{ display: 'inline' }}>
                {translate('Wrong Answer')}
            </h3>
            {' '}
            <EuiPopover
                button={showMoreButton}
                isOpen={isOpen}
                closePopover={() => setIsOpen(false)}
            >
                {result.map((e, index) => <EuiText key={index} color={e ? 'success' : 'danger'}>{`Test Case ${index}`}</EuiText>)}
            </EuiPopover>
        </EuiText>
    }

    return <EuiText color={'danger'}>
        <h3 style={{ display: 'inline' }}>
            {translate('Compilation/Runtime Error')}
        </h3>
        {' '}
        <EuiPopover
            button={showMoreButton}
            isOpen={isOpen}
            closePopover={() => setIsOpen(false)}
        >
            <pre style={{ color: '#BD271E' }}>
                {result}
            </pre>
        </EuiPopover>
    </EuiText>
};

export default RunResult;