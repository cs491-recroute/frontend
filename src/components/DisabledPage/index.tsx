import { EuiCard, EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { translate } from '../../utils';
import styles from './DisabledPage.module.scss';

type DisabledPageProps = {
    children: JSX.Element[];
    isActive: boolean;
}

const DisabledPage = ({children, isActive}: DisabledPageProps) => {

    return (
        <div className={styles.mainContainer}>
            {children}

            {isActive && <><div className={styles.disableDiv}>
                <div className={styles.container}>
                    <EuiCard
                        layout='horizontal'
                        className={classNames(styles.card)}
                        icon={<EuiIcon size="xxl" type='alert' />}
                        title={<div style={{ fontSize: '20px' }}>{translate('Updating is not possible since the flow is active')} </div>}
                        description=''
                    />
                </div>
            </div></>}

        </div>
    );
};

export default DisabledPage;