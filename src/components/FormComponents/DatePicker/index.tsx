import { EuiFormRow, EuiDatePicker, EuiIcon } from '@elastic/eui';
import React from 'react';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync} from '../../../redux/slices/formBuilderSlice';

type DatePickerProps = {
    required?: boolean;
    title?: string;
    editMode?: boolean;
    placeholder?: string;
    _id?: string;
}

const DatePicker = ({ required, title, placeholder, editMode, _id }: DatePickerProps) => {
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
                <EuiFormRow label={title}>
                    <EuiDatePicker 
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

export default DatePicker;