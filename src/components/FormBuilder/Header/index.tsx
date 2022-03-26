import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { getCurrentForm, updateFormTitleAsync } from '../../../redux/slices/formBuilderSlice';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';

const Header = () => {
    const dispatch = useAppDispatch();
    const form = useAppSelector(getCurrentForm);
    const [name, setName] = useState(form.name);
    const [toggle, setToggle] = useState(true)

    useEffect(() => {
        setName(form.name);
    }, [form]);
    
    const handleTitleField = () => {
        if(form){
            dispatch(updateFormTitleAsync({
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