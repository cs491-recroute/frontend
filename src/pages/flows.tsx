import React, { useEffect } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchFlowsAsync, getFlows, isFlowsReady } from '../redux/slices/flowSlice';
import Link from 'next/link';

const FlowsPage: NextPage = () => {
	const { user } = useUser();
	const dispatch = useAppDispatch();
	const flows = useAppSelector(getFlows);
	const isReady = useAppSelector(isFlowsReady);

	useEffect(() => {
		dispatch(fetchFlowsAsync());
	}, []);

	if (!user) return null;

	return (
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
	);
};

export default FlowsPage;

export const getServerSideProps = withPageAuthRequired();