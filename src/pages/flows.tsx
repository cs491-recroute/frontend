import React, { ChangeEvent, ChangeEventHandler, useEffect, useState, useRef } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { deleteFlowAsync, fetchFlowsAsync, getFlows, isFlowsReady, updateFlowAsync, updateFlowsAsync } from '../redux/slices/flowsSlice';
import Link from 'next/link';
import { EuiButton, EuiButtonEmpty, EuiCheckbox, EuiHorizontalRule, EuiIcon, EuiText, EuiLoadingContent, EuiFieldText, EuiFieldSearch } from '@elastic/eui';
import { useWithConfirmation } from '../contexts/confirmation';
import { translate } from '../utils';
import styles from '../styles/Flows.module.scss';
import CreateFlowModal, { CreateFlowRef } from '../components/CreateFlowModal';
import { Paper } from '@mui/material';
import FlowsShareButton from '../components/FlowsShareButton';
import classNames from 'classnames';
import { Flow } from '../types/models';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Checkbox from '@mui/material/Checkbox';

interface SelectedBoxes {
    [key: string]: boolean
}

enum FILTERS {
    all = 0,
    actives,
    favorites,
    archived
}

const FlowsPage: NextPage = () => {
    const createFlowRef = useRef<CreateFlowRef>(null);
    const [checked, setChecked] = useState({} as SelectedBoxes);
    const [anyChecked, setAnyChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState(FILTERS.all);
    const [disableArchive, setDisableArchive] = useState(false);
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

    useEffect(() => {
        const checkedIDs = Object.entries(checked).filter(([key, value]) => value).map(([key, value]) => { return key });
        const checkedFlows = flows.filter(f => checkedIDs.includes(f._id));
        setDisableArchive(!checkedFlows.every(f => !f.active));
        setAnyChecked(checkedIDs.length > 0);
    }, [checked]);

    const handleDeleteButton = withConfirmation({
        onApprove: (flowID: string) => {
            if (flowID) {
                dispatch(deleteFlowAsync(flowID));
            } else {
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
        setChecked(previousState => {
            return { ...previousState, [id]: !checked[id] };
        });
    };

    const clearCheckboxes = () => {
        const initialObj = {} as SelectedBoxes;
        for (const flow of flows) {
            initialObj[flow._id] = false;
        }
        setChecked(initialObj);
        setDisableArchive(false);
    };

    const handleStarClick = (e: ChangeEvent<HTMLInputElement>) => {
        const flowData = {
            flowID: e.target.id,
            body: {
                name: "favorite",
                value: e.target.checked
            }
        }
        dispatch(updateFlowAsync(flowData));
    }

    const handleArchive = () => {
        const flowData = {
            flowIDs: Object.entries(checked).filter(([key, value]) => value).map(([key, value]) => { return key }),
            body: {
                name: "archived",
                value: filter !== FILTERS.archived
            }
        }
        dispatch(updateFlowsAsync(flowData));
        clearCheckboxes();
    }

    const handleFilterChange = (selectedFilter: FILTERS) => {
        setFilter(selectedFilter);
        clearCheckboxes();
    }

    const checkFilters = (flow: Flow) => {
        switch (filter) {
            case FILTERS.all:
                return !flow.archived;
            case FILTERS.actives:
                return flow.active;
            case FILTERS.favorites:
                return flow.favorite;
            case FILTERS.archived:
                return flow.archived;
        }
        return true;
    }

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
                    <EuiButton className={styles.item} fill={filter === FILTERS.all} fullWidth={true}
                        color={'text'}
                        onClick={() => { handleFilterChange(FILTERS.all) }}
                    >
                        {translate('All Flows')}
                    </EuiButton>
                    <EuiButton className={styles.item} fill={filter === FILTERS.actives} fullWidth={true}
                        color={'text'}
                        onClick={() => { handleFilterChange(FILTERS.actives) }}
                    >
                        {translate('Actives')}
                    </EuiButton>
                    <EuiButton className={styles.item} fill={filter === FILTERS.favorites} fullWidth={true}
                        color={'text'}
                        onClick={() => { handleFilterChange(FILTERS.favorites) }}
                    >
                        {translate('Favorites')}
                    </EuiButton>
                    <EuiButton className={styles.item} fill={filter === FILTERS.archived} fullWidth={true}
                        color={'text'}
                        onClick={() => { handleFilterChange(FILTERS.archived) }}
                    >
                        {translate('Archived')}
                    </EuiButton>
                </div>

            </div>
            <div className={styles.rightPanel}>
                <div className={styles.topBar}>
                    {anyChecked && <div className={styles.buttonContainer}>
                        <EuiButton className={styles.button} fullWidth={true}
                            disabled={disableArchive}
                            onClick={handleArchive}
                        >
                            {(filter === FILTERS.archived) ? translate('Unarchive') : translate('Archive')}
                        </EuiButton>
                        <EuiButton className={styles.button} fullWidth={true}
                            onClick={clearCheckboxes}
                        >
                            {translate('Clear')}
                        </EuiButton>
                    </div>}
                    <div />
                    <div className={styles.searchItem}>
                        <EuiFieldSearch
                            type="text"
                            placeholder='Search Flow...'
                            onChange={(event: any) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.flowList} data-testid='flowList'>
                    {isReady ? flows.filter(flow => {
                        if (searchTerm === "" || flow.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return checkFilters(flow);
                        }
                    }).map(flow => {
                        return (
                            <Paper key={flow._id} data-testid={`${flow.name}-card`} className={styles.cardContainer}>
                                <EuiCheckbox
                                    id={flow._id}
                                    checked={checked[flow._id]}
                                    onChange={e => handleCheckboxClick(e)}
                                />
                                <Checkbox
                                    id={flow._id}
                                    icon={<StarOutlineRoundedIcon />}
                                    checkedIcon={<StarRoundedIcon />}
                                    onChange={handleStarClick}
                                    checked={flow.favorite}
                                />
                                <div className={styles.cardContent}>
                                    <div className={styles.flowTitle}>
                                        <Link href={`flowbuilder/${flow._id}`}>
                                            <a>{flow.name}</a>
                                        </Link>
                                    </div>
                                    <div className={styles.details}>
                                        {`${flow.applicants?.length || 0} Applicants, ${flow.stages.length} Stages, ${flow.active ? 'Active' : 'Inactive'}`}
                                    </div>
                                </div>
                                <div style={{ flex: 1 }} />
                                <div className={styles.flowCard}>
                                    <FlowsShareButton flow={flow} />
                                    <Link href={`flowbuilder/${flow._id}`}>
                                        <a>
                                            <EuiButtonEmpty className={styles.cardButton}>
                                                {translate('Edit')}
                                            </EuiButtonEmpty>
                                        </a>
                                    </Link>
                                    <Link href={`submissions/${flow._id}`}>
                                        <a>
                                            <EuiButtonEmpty className={styles.cardButton}>
                                                {translate('Submissions')}
                                            </EuiButtonEmpty>
                                        </a>
                                    </Link>
                                    <EuiButtonEmpty
                                        className={styles.cardDeleteButton}
                                        data-testid={`${flow.name}-delete`}
                                        onClick={() => handleDeleteButton(flow._id)}
                                    >
                                        {translate('Delete')}
                                    </EuiButtonEmpty>
                                </div>
                            </Paper>
                        )
                    }) : <div data-testid='flows-loading'>
                        {[...Array(5)].map((_, i) => <Paper key={i} className={classNames(styles.cardContainer, styles.loading)}>
                            <EuiLoadingContent lines={2} className={styles.loadingContent} />
                        </Paper>)}
                    </div>}
                </div>
            </div>
            <CreateFlowModal ref={createFlowRef} />
        </div>
    );
};

export default FlowsPage;

export const getServerSideProps = withPageAuthRequired();