import React, { ChangeEvent, ChangeEventHandler, useEffect, useState, useRef} from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { deleteFlowAsync, fetchFlowsAsync, getFlows, isFlowsReady } from '../redux/slices/flowsSlice';
import Link from 'next/link';
import { EuiButton, EuiButtonEmpty, EuiCheckbox, EuiHorizontalRule, EuiIcon, EuiText, EuiLoadingContent } from '@elastic/eui';
import { useWithConfirmation } from '../contexts/confirmation';
import { translate } from '../utils';
import styles from '../styles/Flows.module.scss';
import CreateFlowModal, { CreateFlowRef } from '../components/CreateFlowModal';
import { Paper } from '@mui/material';
import FlowsShareButton from '../components/FlowsShareButton';
import classNames from 'classnames';

interface SelectedBoxes {
	[key: string]: boolean
}
const FlowsPage: NextPage = () => {
    const createFlowRef = useRef<CreateFlowRef>(null);
    const [checked, setChecked] = useState({} as SelectedBoxes);
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUser();
    const dispatch = useAppDispatch();
    const flows = useAppSelector(getFlows);
    const isReady = useAppSelector(isFlowsReady);
    const withConfirmation = useWithConfirmation();

    useEffect(() => {
        dispatch(fetchFlowsAsync());
        const initialObj = {} as SelectedBoxes;
        for (const flow of flows) {
            initialObj[flow._id] = false;
        }
        setChecked(initialObj);
    }, []);

    const handleDeleteButton = withConfirmation({
        onApprove: (flowID: string) => {
            if(flowID){
                dispatch(deleteFlowAsync(flowID));
            }else{
                alert('Flow was not deleted!')
            }
        },
        texts: {
            approve: translate('Delete'),
            cancel: translate('Cancel'),
            prompt: <div style={{ textAlign: 'center' }}>
                <EuiText size='m' style={{ fontWeight: 'bold' }}>
                    {translate('Are you sure you want to delete this flow?')}
                </EuiText>
                <EuiText size='s'>
                    {translate('All the submissions will be deleted as well.')}
                </EuiText>
            </div>
        }
    });

    const handleCheckboxClick: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id;
        // setChecked(previousState => {
        // 	return { ...previousState, id: !checked[id] };
        // });
        setChecked({...checked, [id] : !checked[id]});
        console.log(checked);
    };

    if (!user) return null;

    return (
        <div className={styles.mainDiv}>
            <Head>
                <title>{translate('Flows')}</title>
            </Head>
            <div className={styles.leftPanel}>
                <EuiButton className={styles.createButton} onClick={createFlowRef.current?.open} fill
                    data-testid='create-flow-button'
                >
                    <EuiText className={styles.text}>{translate('CREATE FLOW')}</EuiText>
                </EuiButton>
                <EuiHorizontalRule className={styles.rule}></EuiHorizontalRule>
                <div className={styles.itemList}>
                    <EuiButton className={styles.item} fill fullWidth={true}
                        iconSide="right"
                        iconType="arrowRight"
                    >
                        All Flows
                    </EuiButton>
                    <EuiButton className={styles.item} fullWidth={true}>
                        {translate('Actives')}
                    </EuiButton>
                    <EuiButton className={styles.item} fullWidth={true}>
                        {translate('Favorites')}
                    </EuiButton>
                    <EuiButton className={styles.item} fullWidth={true}>
                        {translate('Archived')}
                    </EuiButton>
                </div>

            </div>
            <div className={styles.searchItem}>
                <EuiIcon className={styles.searchIcon} type="search"/>
                <input
                    className={styles.searchBar}
                    type="text"
                    placeholder='Search Flow...'
                    onChange={event => setSearchTerm(event.target.value)}
                />
            </div>
            <div className={styles.flowList} data-testid='flowList'>
                {isReady ? flows.filter( flow => {
                    if (searchTerm === "") {
                        //if query is empty
                        return flow;
                    } else if (flow.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        //returns filtered array
                        console.log(flow.name.toLowerCase());
                        return flow;
                    }
                }).map( flow => {
                    return (
                        <Paper key={flow._id} data-testid={`${flow.name}-card`} className={styles.cardContainer}>
                            <EuiCheckbox
                                id={flow._id}
                                checked={checked[flow._id]}
                                onChange={e => handleCheckboxClick(e)}
                            />
                            <EuiIcon type={'starEmpty'} size={'m'}/>
                            <div className={styles.flowTitle}>
                                <Link href={`flowbuilder/${flow._id}`}>
                                    <a>{flow.name}</a>
                                </Link>
                            </div>
                            <div style={{ flex: 1 }}/>
                            <div className={styles.flowCard}>
                                <FlowsShareButton flow={flow}/>
                                <EuiButtonEmpty>
                                    <Link href={`flowbuilder/${flow._id}`}>
                                        <a style={{color: 'black'}}>{translate('Edit')}</a>
                                    </Link>
                                </EuiButtonEmpty>
                                <EuiButtonEmpty>
                                    <Link href={`submissions/${flow._id}`}>
                                        <a style={{color: 'black'}}>{translate('Submissions')}</a>
                                    </Link>
                                </EuiButtonEmpty>
                                <EuiButtonEmpty style={{color: 'black'}} data-testid={`${flow.name}-delete`} onClick={() => handleDeleteButton(flow._id)}>{translate('Delete')}</EuiButtonEmpty>
                            </div>						
                        </Paper>
                    )}) : <div data-testid='flows-loading'>
                    {[...Array(5)].map((_, i) => <Paper key={i} className={classNames(styles.cardContainer, styles.loading)}>
                        <EuiLoadingContent lines={2} className={styles.loadingContent}/>
                    </Paper>)}
                </div>}
            </div>
            <CreateFlowModal ref={createFlowRef} />
        </div>
    );
};

export default FlowsPage;

export const getServerSideProps = withPageAuthRequired();