import React from 'react';
import styles from './AdminConsolePagination.module.scss';

const AdminConsolePagination = (props: any) => {

    return(
        <div className={styles.Pagination}>
            <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>&laquo;</button>
            {props.resp.page - 1 === 0 && props.resp.totalPages - props.resp.page === 0 &&
                <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>1</button>
            }
            {props.resp.page - 1 === 1 && props.resp.totalPages - props.resp.page === 0 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.paginationButtons}>2</button>
            </>
            }
            {props.resp.page - 1 >= 2 && props.resp.totalPages - props.resp.page === 0 &&
            <>
                <button className={styles.paginationButtons}>...</button>
                <button onClick={() => props.handlePageChange(props.resp.prevPage)} className={styles.paginationButtons}>{props.resp.prevPage}</button>
                <button onClick={() => props.handlePageChange(props.resp.page)} className={styles.paginationButtons}>{props.resp.page}</button>
            </> 
            }
            {props.resp.page - 1 === 0 && props.resp.totalPages - props.resp.page === 1 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.paginationButtons}>2</button>
            </>
            }
            {props.resp.page - 1 === 1 && props.resp.totalPages - props.resp.page === 1 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.paginationButtons}>2</button>
                <button onClick={() => props.handlePageChange(3)} className={styles.paginationButtons}>3</button>
            </>
            }
            {props.resp.page - 1 >= 2 && props.resp.totalPages - props.resp.page === 1 &&
            <>
                <button className={styles.paginationButtons}>...</button>
                <button onClick={() => props.handlePageChange(props.resp.prevPage)} className={styles.paginationButtons}>{props.resp.prevPage}</button>
                <button onClick={() => props.handlePageChange(props.resp.page)} className={styles.paginationButtons}>{props.resp.page}</button>
                <button onClick={() => props.handlePageChange(props.resp.nextPage)} className={styles.paginationButtons}>{props.resp.nextPage}</button>
            </> 
            }{props.resp.page - 1 === 0 && props.resp.totalPages - props.resp.page >= 2 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.paginationButtons}>2</button>
                <button className={styles.paginationButtons}>...</button>
            </>
            }
            {props.resp.page - 1 === 1 && props.resp.totalPages - props.resp.page >= 2 &&
            <>
                <button onClick={() => props.handlePageChange(1)} className={styles.paginationButtons}>1</button>
                <button onClick={() => props.handlePageChange(2)} className={styles.paginationButtons}>2</button>
                <button onClick={() => props.handlePageChange(3)} className={styles.paginationButtons}>3</button>
                <button className={styles.paginationButtons}>...</button>
            </>
            }
            {props.resp.page - 1 >= 2 && props.resp.totalPages - props.resp.page >= 2 &&
            <>
                <button className={styles.paginationButtons}>...</button>
                <button onClick={() => props.handlePageChange(props.resp.prevPage)} className={styles.paginationButtons}>{props.resp.prevPage}</button>
                <button onClick={() => props.handlePageChange(props.resp.page)} className={styles.paginationButtons}>{props.resp.page}</button>
                <button onClick={() => props.handlePageChange(props.resp.nextPage)} className={styles.paginationButtons}>{props.resp.nextPage}</button>
                <button className={styles.paginationButtons}>...</button>
            </> 
            }
            <button onClick={() => props.handlePageChange(props.resp.totalPages)} className={styles.paginationButtons}>&raquo;</button>
        </div>
    )
}

export default AdminConsolePagination;