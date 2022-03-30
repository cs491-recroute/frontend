import { EuiCard, EuiIcon } from '@elastic/eui';
import classNames from 'classnames';
import React from 'react';
import { translate } from '../../utils';
import styles from './DisabledPage.module.scss';

const DisabledPage = () => {

    return (
        <div className={styles.mainContainer}>
            <div className={styles.disableDiv}></div>
            <div className={styles.container}>
                <EuiCard
                    layout='horizontal'
                    className={classNames(styles.card)}
                    icon={<EuiIcon size="xxl" type='alert' />}
                    title={<div style={{fontSize: '20px'}}>{translate('Updating is not possible since the flow is active')} </div>}
                    description=''
                />
            </div>
        </div>
    );
};

export default DisabledPage;