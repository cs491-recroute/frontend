import { EuiButton, EuiCollapsibleNav, EuiText } from '@elastic/eui';
import { List, ListItem, ListItemButton } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { addQuestionAsync, isLeftPanelOpen, toggleLeftPanel } from '../../../redux/slices/testBuilderSlice';
import { translate } from '../../../utils';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import styles from './LeftPanel.module.scss';
import { QUESTION_MAPPINGS } from '../Questions/constants';
import { Question } from './../../../types/models';
import { Tabs, Tab } from '@mui/material';

const LeftPanel = () => {
    const [activeTab, setActiveTab] = useState(0);
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(isLeftPanelOpen);
    
    const toggle = useCallback(status => () => {
        if (status !== isLeftPanelOpen) dispatch(toggleLeftPanel(status));
    }, [isLeftPanelOpen]);

    const handleBasicSelect = (defaultProps: Partial<Question>) => () => {
        dispatch(addQuestionAsync(defaultProps));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    }

    const TabContent = () => {
        switch(activeTab) {
            case 0: {
                return <List>
                    {Object.values(QUESTION_MAPPINGS).map(({ text, type, defaultProps }) => (
                        <ListItem 
                            key={type}
                            disablePadding 
                            divider
                        >
                            <ListItemButton className={styles.item} onClick={handleBasicSelect(defaultProps)} >{text}</ListItemButton>
                        </ListItem>
                    ))}
                </List>
            }
            case 1: {
                return <div>My Questions</div> // TODO
            }
            case 2: {
                return <div>Pool</div> // TODO
            }
            default: return null
        }
    }
    return (
        <EuiCollapsibleNav
            className={styles.leftPanel}
            style={{ top: 120 }}
            isOpen={isOpen}
            onClose={toggle(false)}
            closeButtonPosition="inside"
            ownFocus={false}
            button={
                <EuiButton onClick={toggle(true)} iconType='plusInCircle' className={styles.openButton}>
                    {translate('Add New Question')}
                </EuiButton>
            }
        >
            <EuiText className={styles.title}>
                {translate('Questions')}
            </EuiText>
            <hr />
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label={translate('Basic')}/>
                <Tab label={translate('My Questions')}/>
                <Tab label={translate('Pool')}/>
            </Tabs>
            <TabContent />
        </EuiCollapsibleNav>
    )
};

export default LeftPanel;