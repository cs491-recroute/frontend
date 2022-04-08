import { EuiFormRow } from '@elastic/eui';
import React from 'react';
import styles from './Header.module.scss'

type HeaderProps = {
    title?: string;
    editMode?: boolean;
}

const Header = ({ title, editMode }: HeaderProps) => {
    return <EuiFormRow fullWidth>
        <div
            aria-disabled={editMode}
        >
            <h1 className={styles.heading}>{title}</h1>
            <hr className={styles.hr}></hr>
        </div>
    </EuiFormRow>

};

export default Header;