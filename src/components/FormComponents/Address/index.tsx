import { EuiFieldText, EuiFormRow, EuiIcon } from '@elastic/eui';
import React from 'react';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync} from '../../../redux/slices/formBuilderSlice';

type AddressProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
    _id?: string;
}

const Address = ({ required, title, placeholder, editMode, _id }: AddressProps) => {
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
            <th>
                <EuiFormRow label={title} fullWidth>
                    <EuiFieldText 
                        fullWidth
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholder}
                    />
                </EuiFormRow>
            </th>
            <th>
                <button>
                    <EuiIcon type="gear" style={{marginTop:30}}/>
                </button>
                <button onClick={handleComponentDelete}>
                    <EuiIcon type="trash" style={{marginLeft:20, marginTop:30}}/>
                </button>
            </th>
        </tr>
    </table>
};

export default Address;