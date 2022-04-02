import { EuiFormRow, EuiTextArea,EuiIcon } from '@elastic/eui';
import React from 'react';
import {useAppDispatch } from '../../../utils/hooks';
import { deleteComponentAsync} from '../../../redux/slices/formBuilderSlice';

type HeaderProps = {
    required?: boolean;
    title?: string;
    placeholder?: string;
    editMode?: boolean;
    _id?: string;
}

const Header = ({ required, title, placeholder, editMode, _id }: HeaderProps) => {
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
                    <EuiTextArea 
                        fullWidth 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholder}
                        resize={editMode ? 'none' : 'vertical'}
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

export default Header;