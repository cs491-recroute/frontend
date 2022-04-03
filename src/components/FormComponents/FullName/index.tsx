import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React from 'react';

type FullNameProps = {
    required?: boolean;
    titles?: string[];
    placeholders?: string[];
    editMode?: boolean;
}

const FullName = ({ required, titles, placeholders, editMode }: FullNameProps) => {
    return <table>
        <tr>
            <th>
                <EuiFormRow label={titles?.[0]} fullWidth>
                    <EuiFieldText 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholders?.[0]}
                    />
                </EuiFormRow>
            </th>
            <th style={{marginLeft:'10px'}}>
                <EuiFormRow label={titles?.[1]} fullWidth>
                    <EuiFieldText 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholders?.[1]}
                    />
                </EuiFormRow>
            </th>
        </tr>
    </table> 
    
};

export default FullName;