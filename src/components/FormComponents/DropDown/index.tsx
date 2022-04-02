import { EuiFormRow, EuiSelect, EuiIcon } from '@elastic/eui';
import React from 'react';
import {Option} from '../../../types/models';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync} from '../../../redux/slices/formBuilderSlice';

type DropDownProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
    options?: Option[];
    _id?: string;
}

const DropDown = ({ required, title, placeholder, editMode, options, _id }: DropDownProps) => {
    const dispatch = useAppDispatch();

    const handleComponentDelete = () => {
        if(_id){
            dispatch(deleteComponentAsync(_id));
        } else {
            console.log("Error while deleting component from form");
        }
        
    };

    const newArray = options?.map(option => {
        return {
            key: option.key,
            text: option.value
        }; 
    });

    return <table>
        <tr>
            <th>
                <EuiFormRow label={title} fullWidth>
                    <EuiSelect 
                        fullWidth
                        options={newArray} 
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

export default DropDown;