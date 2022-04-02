import { EuiFieldText, EuiFormRow, EuiIcon } from '@elastic/eui';
import React from 'react';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync} from '../../../redux/slices/formBuilderSlice';

type FullNameProps = {
    required?: boolean;
    titles?: string[];
    placeholders?: string[];
    editMode?: boolean;
    _id?: string;
}

const FullName = ({ required, titles, placeholders, editMode, _id }: FullNameProps) => {
    const dispatch = useAppDispatch();

    const handleComponentDelete = () => {
        if(_id){
            dispatch(deleteComponentAsync(_id));
        } else {
            console.log("Error while deleting component from form");
        }
        
    };

    return <table>
        <tr>
            <th style={{marginRight:20}}>
                <EuiFormRow label={titles?.[0]} fullWidth>
                    <EuiFieldText 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholders?.[0]}
                    />
                </EuiFormRow>
            </th>
            <th style={{marginLeft:20}}>
                <EuiFormRow label={titles?.[1]} fullWidth>
                    <EuiFieldText 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholders?.[1]}
                    />
                </EuiFormRow>
            </th>
            <th>
                <button>
                    <EuiIcon type="gear" style={{marginTop:30}}/>
                </button>
                <button  onClick={handleComponentDelete}>
                    <EuiIcon type="trash" style={{marginLeft:20, marginTop:30}}/>
                </button>
            </th>
        </tr>
    </table> 
    
};

export default FullName;