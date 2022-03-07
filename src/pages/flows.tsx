import React, { useEffect, useRef } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchFlowsAsync, getFlows, isFlowsReady } from '../redux/slices/flowsSlice';
import Link from 'next/link';
import { EuiButton, EuiHorizontalRule, EuiText } from '@elastic/eui';
import styles from '../styles/Flows.module.scss';
import CreateFlowModal, { CreateFlowRef } from '../components/CreateFlowModal';


const FlowsPage: NextPage = () => {
	const createFlowRef = useRef<CreateFlowRef>(null);
	const { user } = useUser();
	const dispatch = useAppDispatch();
	const flows = useAppSelector(getFlows);
	const isReady = useAppSelector(isFlowsReady);

	useEffect(() => {
		dispatch(fetchFlowsAsync());
	}, []);

	if (!user) return null;

	return (
		<div className={styles.mainDiv}>
			<div className={styles.leftPanel}>
				<EuiButton className={styles.createButton} onClick={createFlowRef.current?.open}>
					<EuiText className={styles.text}>CREATE FLOW</EuiText>
				</EuiButton>
				<EuiHorizontalRule className={styles.rule}></EuiHorizontalRule>
				<div className={styles.itemList}>
					<EuiButton className={styles.item} fullWidth={true} iconSide="right" iconType="arrowRight">
						All Flows
					</EuiButton>
				</div>

			</div>
			<div>
				FLOWS PAGE
				{isReady ? flows.map(({ name, _id }) => (
					<div key={name}>
						<Link href={`flowbuilder/${_id}`}>
							<a>{name}</a>
						</Link>
					</div>
				)) : <div>Fetching</div>}
			</div>
			<CreateFlowModal ref={createFlowRef} />
		</div>
	);
};

export default FlowsPage;

export const getServerSideProps = withPageAuthRequired();