import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { getCurrentTest, updateTestTitleAsync } from '../../../redux/slices/testBuilderSlice';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';

const Header = () => {
    const dispatch = useAppDispatch();
    const test = useAppSelector(getCurrentTest);
    const [name, setName] = useState(test.name);
    const [toggle, setToggle] = useState(true)

    useEffect(() => {
        setName(test.name);
    }, [test]);
    
    const handleTitleField = () => {
        if(test){
            dispatch(updateTestTitleAsync({
                name: "name",
                value: name
            }));
        }else{
            alert('Error: Name is not changed')
        } 
    };

    return <div className={styles.container}>
        {toggle ? (<p onDoubleClick={() => {setToggle(false)}}>{name}</p>) : (<input className={styles.input} type='text' value={name}
            onChange={event => {setName(event.target.value)}}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    handleTitleField()
                    setToggle(true)
                    event.preventDefault()
                    event.stopPropagation()
                }
            }}
        />)}
        <IconButton className={styles.settingsIcon} >
            <SettingsIcon />
        </IconButton>
    </div>
};

export default Header;