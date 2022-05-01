import React from 'react';
import styles from './AdminConsolePagination.module.scss';

const AdminConsolePagination = (props: any) => {

    return(
        <div className={styles.pagination}>
            <button onClick={() => props.handlePageChange(1)}>&laquo;</button>
            {props.resp.page - 1 === 0 && props.resp.totalPages - props.resp.page === 0 &&
                <button onClick={() => props.handlePageChange(1)} className={styles.active}>1</button>
            }
            {props.resp.page - 1 === 1 && props.resp.totalPages - props.resp.page === 0 &&
            <>
                <button onClick={() => props.handlePageChange(1)}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.active}>2</button>
            </>
            }
            {props.resp.page - 1 >= 2 && props.resp.totalPages - props.resp.page === 0 &&
            <>
                <button>...</button>
                <button onClick={() => props.handlePageChange(props.resp.prevPage)}>{props.resp.prevPage}</button>
                <button onClick={() => props.handlePageChange(props.resp.page)} className={styles.active}>{props.resp.page}</button>
            </> 
            }
            {props.resp.page - 1 === 0 && props.resp.totalPages - props.resp.page === 1 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.active}>1</button>
                <button onClick={() => props.handlePageChange(2)}>2</button>
            </>
            }
            {props.resp.page - 1 === 1 && props.resp.totalPages - props.resp.page === 1 &&
            <>
                <button onClick={() => props.handlePageChange(1)}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.active}>2</button>
                <button onClick={() => props.handlePageChange(3)}>3</button>
            </>
            }
            {props.resp.page - 1 >= 2 && props.resp.totalPages - props.resp.page === 1 &&
            <>
                <button>...</button>
                <button onClick={() => props.handlePageChange(props.resp.prevPage)}>{props.resp.prevPage}</button>
                <button onClick={() => props.handlePageChange(props.resp.page)} className={styles.active}>{props.resp.page}</button>
                <button onClick={() => props.handlePageChange(props.resp.nextPage)}>{props.resp.nextPage}</button>
            </> 
            }{props.resp.page - 1 === 0 && props.resp.totalPages - props.resp.page >= 2 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.active}>1</button>
                <button onClick={() => props.handlePageChange(2)}>2</button>
                <button>...</button>
            </>
            }
            {props.resp.page - 1 === 1 && props.resp.totalPages - props.resp.page >= 2 &&
            <>
                <button onClick={() => props.handlePageChange(1)}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.active}>2</button>
                <button onClick={() => props.handlePageChange(3)}>3</button>
                <button>...</button>
            </>
            }
            {props.resp.page - 1 >= 2 && props.resp.totalPages - props.resp.page >= 2 &&
            <>
                <button>...</button>
                <button onClick={() => props.handlePageChange(props.resp.prevPage)}>{props.resp.prevPage}</button>
                <button onClick={() => props.handlePageChange(props.resp.page)} className={styles.active}>{props.resp.page}</button>
                <button onClick={() => props.handlePageChange(props.resp.nextPage)}>{props.resp.nextPage}</button>
                <button>...</button>
            </> 
            }
            <button onClick={() => props.handlePageChange(props.resp.totalPages)}>&raquo;</button>
        </div>
    )
}

export default AdminConsolePagination;