import { EuiButton, EuiCollapsibleNav, EuiText } from '@elastic/eui';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import { addQuestionAsync, isLeftPanelOpen, toggleLeftPanel, getMyQuestionsAsync, getQuestions, getCategoriesAsync, getCategories, getPoolQuestionsAsync} from '../../../redux/slices/testBuilderSlice';
import { translate } from '../../../utils';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import styles from './LeftPanel.module.scss';
import { QUESTION_MAPPINGS } from '../Questions/constants';
import { Question } from './../../../types/models';
import { Tabs, Tab } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PreviewQuestionModal, { PreviewQuestionModalRef } from '../../PreviewQuestionModal';

const LeftPanel = () => {
    const previewQuestionRef = useRef<PreviewQuestionModalRef>(null);
    const [activeTab, setActiveTab] = useState(0);
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(isLeftPanelOpen);
    const questions = useAppSelector(getQuestions);
    const categories = useAppSelector(getCategories);
    const  [selectedCategory, setSelectedCategory] = useState({
        categoryID: '',
        name: ''
    });
    
    const toggle = useCallback(status => () => {
        if (status !== isLeftPanelOpen) dispatch(toggleLeftPanel(status));
    }, [isLeftPanelOpen]);

    const handleBasicSelect = (defaultProps: Partial<Question>) => () => {
        dispatch(addQuestionAsync(defaultProps));
    };
    
    const getMyQuestions = () => {
        dispatch(getMyQuestionsAsync());
    };

    const getPoolCategories = () => {
        dispatch(getCategoriesAsync());
    };

    const getPoolQuestions = (categoryID: string, name: string) => {
        setSelectedCategory({categoryID, name});
        dispatch(getPoolQuestionsAsync(categoryID));
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
                return <List>
                    {questions.map(question => (
                        <ListItem 
                            key={question._id}
                            disablePadding 
                            divider
                        >
                            <ListItemButton className={styles.item} >
                                <ListItemText onClick={handleBasicSelect(question)} primary={question.description}/>
                                <VisibilityIcon onClick={() => previewQuestionRef.current?.open()}/>
                            </ListItemButton>
                            <PreviewQuestionModal question={question} ref={previewQuestionRef} />
                        </ListItem>
                    ))}
                </List>            }
            case 2: {
                return <List>
                    {categories.map(({ name, _id }) => (
                        <ListItem 
                            key={_id}
                            disablePadding 
                            divider
                        >
                            <ListItemButton className={styles.item} onClick={() => getPoolQuestions(_id, name)} >{name}</ListItemButton>
                        </ListItem>
                    ))}
                </List>
            }
            default: return null
        }
    }

    const CategoryContent = () => {
        return <List>
            {questions.map(question => (
                <ListItem 
                    key={question._id}
                    disablePadding 
                    divider
                >
                    <ListItemButton className={styles.item}  >
                        <ListItemText onClick={handleBasicSelect(question)} primary={question.description}/>
                        <VisibilityIcon onClick={() => previewQuestionRef.current?.open()}/>
                    </ListItemButton>
                    <PreviewQuestionModal question={question} ref={previewQuestionRef} />
                </ListItem>
            ))}
        </List> 
    }

    return (
        <><EuiCollapsibleNav
            className={styles.leftPanel}
            style={{ top: 120 }}
            isOpen={isOpen}
            onClose={toggle(false)}
            closeButtonPosition="inside"
            ownFocus={false}
            outsideClickCloses={false}
            button={<EuiButton onClick={toggle(true)} iconType='plusInCircle' className={styles.openButton}>
                {translate('Add New Question')}
            </EuiButton>}
        >
            <EuiText className={styles.title}>
                {translate('Questions')}
            </EuiText>
            <hr />
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label={translate('Basic')} />
                <Tab label={translate('My Questions')} onClick={getMyQuestions}/>
                <Tab label={translate('Pool')} onClick={getPoolCategories}/>
            </Tabs>
            <TabContent />
        </EuiCollapsibleNav>
        {isOpen && (activeTab === 2) && selectedCategory.categoryID && <EuiCollapsibleNav
            className={styles.secondLeftPanel}
            style={{ top: 168 }}
            isOpen={isOpen}
            onClose={() => setSelectedCategory({categoryID: '', name: ''})}
            closeButtonPosition="inside"
            ownFocus={false}
            outsideClickCloses={false}

        >
            <EuiText className={styles.title}>
                {selectedCategory.name}
            </EuiText>
            <hr />
            <CategoryContent />
        </EuiCollapsibleNav>}
        </>
    )
};

export default LeftPanel;