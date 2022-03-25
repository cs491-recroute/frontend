import React, { Fragment, useCallback, useState } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FormBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { ComponentTypes, Form } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { useRouterWithReturnBack } from '../../utils/hooks';
import { COMPONENT_MAPPINGS, MAIN_PAGE } from '../../constants';
import { EuiButton, EuiCollapsibleNav, EuiIcon, EuiSelectableOption, EuiCard, EuiText, EuiFieldText, EuiForm} from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
    isRightPanelOpen as isFormBuilderRightPanelOpen,
    toggleRightPanel as toggleFormBuilderRightPanel,
    options,
    setCurrentForm,
    getCurrentForm
} from '../../redux/slices/formBuilderSlice';

import {List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import { nanoid } from "nanoid";
import { wrapper } from '../../redux/store';
import LeftPanel from '../../components/FormBuilder/LeftPanel';

// eslint-disable-next-line @typescript-eslint/ban-types
type FormBuilderProps = {}

const FormBuilderPage: NextPage<FormBuilderProps> = () => {
    const { returnAvailable, returnBack } = useRouterWithReturnBack();
    const [formElements, setFormElements] = useState([]);

    const dispatch = useAppDispatch();
    const { name } = useAppSelector(getCurrentForm);
    const isRightPanelOpen = useAppSelector(isFormBuilderRightPanelOpen);

    const toggleRightPanel = useCallback(status => () => {
        if (status !== isRightPanelOpen) dispatch(toggleFormBuilderRightPanel(status));
    }, [isRightPanelOpen]);

    type formElementType = {
        label:string;
        id: string;
    }

    const FormElement = (props:formElementType) => {
        return(
            <table style={{marginTop:10}}>
                <tr>
                    <th style={{width:350}}>
                        <EuiText textAlign='left'>{props.label}</EuiText>
                        <EuiFieldText/>
                    </th>
                    <th>
                        <button onClick={toggleRightPanel(true)}>
                            <EuiIcon type="gear" style={{marginLeft:10}}/>
                        </button>
                        <button onClick={() => deleteFormElement(props.id)}>
                            <EuiIcon type="trash" style={{marginLeft:10}}/>
                        </button>
                    </th>
                </tr>
            </table>
        )
    }

    const deleteFormElement = (id:string) => {
        setFormElements(formElements.filter((formElement : formElementType) => id !== formElement.id));
    }

    const addFormElement = (label:string) => {
        const newId = nanoid();
        const newFormElement = <FormElement id={newId} label={label}/>;
        setFormElements(formElements.concat(newFormElement));
    }

    const createListItem = (option:EuiSelectableOption) => {
        return(
            <ListItem disablePadding>
                <ListItemButton onClick={() => addFormElement(option.label)}>
                    <ListItemText primary={option.label} />
                </ListItemButton>
            </ListItem>
        )
    }
    
    const FormCard = () => {
        return( 
            <EuiCard 
                className={styles.card}
                title="Form Title"
            >
                <EuiForm>
                    {formElements}
                </EuiForm>
                {returnAvailable && 
                    <EuiButton 
                        className={styles.returnToFlow} 
                        onClick={returnBack}
                    >
                        Return to Flow
                    </EuiButton>
                }
            </EuiCard>
        );
    }
    
    return (<Fragment>
        <div className={styles.header}>
            {name}
            <EuiIcon type="gear" size="l" className={styles.settingsIcon}/>
        </div>
        <LeftPanel />
        <EuiCollapsibleNav
            className={styles.rightPanel}
            style={{ top: 120 }}
            isOpen={isRightPanelOpen}
            onClose={toggleRightPanel(false)}
            closeButtonPosition="inside"
            ownFocus={false}
            side="right"
        >
            <EuiText className={styles.title}>
                {translate('Element Settings')}
            </EuiText>
            <hr/>
        </EuiCollapsibleNav>
        <div className={styles.content}>
            <div>
                <FormCard />
            </div>
        </div>
    </Fragment>);
};

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: wrapper.getServerSideProps(({ dispatch }) => async context => {
        const { formID } = context.query;
        try {
            const { data: form }: AxiosResponse<Form> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/form/${formID}`);
            dispatch(setCurrentForm(form));
            return { props: {}};
        } catch (error) {
            return {
                redirect: {
                    permanent: false,
                    destination: MAIN_PAGE
                }
            };
        }
    })
});

export default FormBuilderPage;