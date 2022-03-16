import React, { Children, Fragment, useCallback, useState } from 'react';
import { NextApiRequest, NextApiResponse, NextPage } from 'next';
import styles from '../../styles/FormBuilder.module.scss';
import { AxiosResponse } from 'axios';
import { Form } from '../../types/models';
import { gatewayManager } from '../../utils/gatewayManager';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { SERVICES } from '../../constants/services';
import { translate } from '../../utils';
import { MAIN_PAGE } from '../../constants';
import { EuiButton, EuiCollapsibleNav, EuiIcon, EuiSelectable, EuiSelectableOption, EuiCard, EuiText, EuiFieldText, EuiFormRow, EuiForm} from '@elastic/eui';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { 
    isLeftPanelOpen as isFormBuilderLeftPanelOpen,
    toggleLeftPanel as toggleFormBuilderLeftPanel
} from '../../redux/slices/formBuilderSlice';
import { useRouter } from 'next/router';

import {List, ListItem, ListItemButton, ListItemText} from '@mui/material';

type FormBuilderProps = {
    form: Form;
}

type FormOption = EuiSelectableOption;

const options : FormOption[] = [
    {label: 'Full Name'}, 
    {label: 'Header'},
    {label: 'Email'},
    {label: 'Address'},
    {label: 'Phone number'}
];

const FormBuilderPage: NextPage<FormBuilderProps> = ({ form }: FormBuilderProps) => {
    const { query: { returnTo }, push } = useRouter();
    const [formElements, setFormElements] = useState([]);
    const [formElementCount, setFormElementCount] = useState(0);

    const { name } = form;
    const dispatch = useAppDispatch();
    const isLeftPanelOpen = useAppSelector(isFormBuilderLeftPanelOpen);

    const toggleLeftPanel = useCallback(status => () => {
        if (status !== isLeftPanelOpen) dispatch(toggleFormBuilderLeftPanel(status));
    }, [isLeftPanelOpen]);

    type formElementType = {
        label:string;
        id: number;
    }

    function FormElement(props:formElementType){
        return(
            <table style={{marginTop:10}}>
                <tr>
                    <th style={{width:350}}>
                        <EuiText textAlign='left'>{props.label}</EuiText>
                        <EuiFieldText/>
                    </th>
                    <th>
                        <button>
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

    /*
    function deleteFormElement(id:number) {
        setFormElements(formElements.pop());
        setFormElementCount(formElementCount - 1);
    }*/

    function addFormElement(label:string) {
        setFormElements(formElements.concat(<FormElement id={formElementCount} label={label}/>));
        setFormElementCount(formElementCount + 1);
    }

    function createListItem(option:EuiSelectableOption){
        return(
            <ListItem disablePadding>
                <ListItemButton onClick={() => addFormElement(option.label)}>
                    <ListItemText primary={option.label} />
                </ListItemButton>
            </ListItem>
        )
    }
    
    function FormCard(){
        return( 
            <EuiCard 
                className={styles.card}
                title="Form Title"
            >
                <EuiForm>
                    {formElements}
                </EuiForm>
                {returnTo && 
                    <EuiButton 
                        className={styles.returnToFlow} 
                        onClick={() => push(returnTo.toString())}
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
        <EuiCollapsibleNav
            className={styles.leftPanel}
            style={{ top: 120 }}
            isOpen={isLeftPanelOpen}
            onClose={toggleLeftPanel(false)}
            closeButtonPosition="inside"
            ownFocus={false}
            button={
                <EuiButton onClick={toggleLeftPanel(true)} iconType='plusInCircle'>
    Create New Form
                </EuiButton>
            }
        >
            <EuiText className={styles.title}>
                {translate('Form Elements')}
            </EuiText>
            <hr/>
            <List>
                {options.map(createListItem)}
            </List>
        </EuiCollapsibleNav>
        <div className={styles.content}>
            <div>
                <FormCard />
            </div>
        </div>
    </Fragment>);
};

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: async context => {
        const { formID } = context.query;
        try {
            const { data: form }: AxiosResponse<Form> = await gatewayManager.useService(SERVICES.FLOW).addUser(context.req as NextApiRequest, context.res as NextApiResponse).get(`/form/${formID}`);
            return { props: { form } as FormBuilderProps};
        } catch (error) {
            return {
                redirect: {
                    permanent: false,
                    destination: MAIN_PAGE
                }
            };
        }
    }
});

export default FormBuilderPage;