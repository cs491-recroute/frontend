import React, { ChangeEvent, ChangeEventHandler, useEffect, useState, useRef, MouseEventHandler } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { deleteFlowAsync, fetchFlowsAsync, getFlows, isFlowsReady } from '../redux/slices/flowsSlice';
import Link from 'next/link';
import { EuiButton, EuiButtonEmpty, EuiCheckbox, EuiHorizontalRule, EuiLink, EuiText } from '@elastic/eui';
import styles from '../styles/Flows.module.scss';
import CreateFlowModal, { CreateFlowRef } from '../components/CreateFlowModal';
import { Paper } from '@mui/material';

interface SelectedBoxes {
	[key: string]: boolean
}
const FlowsPage: NextPage = () => {
    const createFlowRef = useRef<CreateFlowRef>(null);
    const [checked, setChecked] = useState({} as SelectedBoxes);
    const { user } = useUser();
    const dispatch = useAppDispatch();
    const flows = useAppSelector(getFlows);
    const isReady = useAppSelector(isFlowsReady);

    useEffect(() => {
        dispatch(fetchFlowsAsync());
        const initialObj = {} as SelectedBoxes;
        for (const flow of flows) {
            initialObj[flow._id] = false;
        }
        setChecked(initialObj);
    }, []);

    const handleDeleteButton = (flowID: string) => {
        if(flowID){
            dispatch(deleteFlowAsync(flowID));
        }else{
            alert('Flow was not deleted!')
        }
    };

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
            <div className={styles.leftPanel}>
                <EuiButton className={styles.createButton} onClick={createFlowRef.current?.open}>
                    <EuiText className={styles.text}>CREATE FLOW</EuiText>
                </EuiButton>
                <EuiHorizontalRule className={styles.rule}></EuiHorizontalRule>
                <div className={styles.itemList}>
                    <EuiButton className={styles.item} fullWidth={true} iconSide="right"
                        iconType="arrowRight"
                    >
                        All Flows
                    </EuiButton>
                </div>

            </div>
            <div className={styles.flowList}>
                FLOWS PAGE
                {isReady ? flows.map(({ name, _id }) => (
                    <Paper key={_id}  className={styles.cardContainer}>
                        <EuiCheckbox
                            id={_id}
                            checked={checked[_id]}
                            onChange={e => handleCheckboxClick(e)}
                        />
                        <div className={styles.flowTitle}>
                            <Link href={`flowbuilder/${_id}`}>
                                <a>{name}</a>
                            </Link>
                            <div className={styles.description}>description</div>
                        </div>
                        <div style={{ flex: 1 }}/>
                        <div className={styles.flowCard}>
                            <EuiButtonEmpty color='text' isSelected={true}>Share</EuiButtonEmpty>
                            <EuiButtonEmpty color='text' href={`flowbuilder/${_id}`}>Edit</EuiButtonEmpty>
                            <EuiButtonEmpty color='text'>Submissions</EuiButtonEmpty>
                            <EuiButtonEmpty color='text' onClick={() => handleDeleteButton(_id)}>Delete</EuiButtonEmpty>
                        </div>						
                    </Paper>
                )) : <div>Fetching</div>}
            </div>
            <CreateFlowModal ref={createFlowRef} />
        </div>
    );
};

export default FlowsPage;

export const getServerSideProps = withPageAuthRequired();