import { EuiButton, EuiCollapsibleNav, EuiText } from '@elastic/eui';
import { List, ListItem, ListItemButton } from '@mui/material';
import React, { useCallback } from 'react';
import { COMPONENT_MAPPINGS } from '../../../constants';
import { addComponentAsync, isLeftPanelOpen, toggleLeftPanel } from '../../../redux/slices/formBuilderSlice';
import { translate } from '../../../utils';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import styles from './LeftPanel.module.scss';

const LeftPanel = () => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(isLeftPanelOpen);
    
    const toggle = useCallback(status => () => {
        if (status !== isLeftPanelOpen) dispatch(toggleLeftPanel(status));
    }, [isLeftPanelOpen]);

    const handleComponentSelect = (defaultProps: Record<any, any>) => () => {
        dispatch(addComponentAsync(defaultProps));
    };

    return (
        <EuiCollapsibleNav
            className={styles.leftPanel}
            style={{ top: 120 }}
            isOpen={isOpen}
            onClose={toggle(false)}
            closeButtonPosition="inside"
            ownFocus={false}
            button={
                <EuiButton onClick={toggle(true)} iconType='plusInCircle'>
                    {translate('Add New Form Component')}
                </EuiButton>
            }
        >
            <EuiText className={styles.title}>
                {translate('Form Elements')}
            </EuiText>
            <hr/>
            <List>
                {Object.values(COMPONENT_MAPPINGS).map(({ text, type, defaultProps }) => (
                    <ListItem 
                        key={type}
                        disablePadding 
                        divider
                    >
                        <ListItemButton className={styles.item} onClick={handleComponentSelect(defaultProps)} >{text}</ListItemButton>
                    </ListItem>
                ))}
                
            </List>
        </EuiCollapsibleNav>
    )
};

export default LeftPanel;