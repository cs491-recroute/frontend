import React from 'react';
import styles from './Header.module.scss';
import { useAppSelector } from '../../../utils/hooks';
import { getCurrentTest } from '../../../redux/slices/testBuilderSlice';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';

const Header = () => {
    const test = useAppSelector(getCurrentTest);
    return <div className={styles.container}>
        {test.name}
        <IconButton className={styles.settingsIcon} >
            <SettingsIcon />
        </IconButton>
    </div>
};

export default Header;