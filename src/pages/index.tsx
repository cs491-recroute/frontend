import type { NextPage, GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { MAIN_PAGE } from '../constants';

const IndexPage: NextPage = () => {
    return null;
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    const session = getSession(req, res);

    return {
        redirect: {
            permanent: false,
            destination: session ? MAIN_PAGE : '/landing'
        }
    };
};