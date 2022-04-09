import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';

type FullNameProps = {
    required?: boolean;
    titles?: string[];
    placeholders?: string[];
    editMode?: boolean;
}

const FullName = forwardRef(({ required, titles, placeholders, editMode }: FullNameProps, ref) => {
    const [answer, setAnswer] = useState({ name: '', surname: '' });

    useImperativeHandle(ref, () => ({ answer }));

    return <table>
        <tr>
            <th>
                <EuiFormRow label={titles?.[0]} fullWidth>
                    <EuiFieldText 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholders?.[0]}
                        value={answer.name}
                        onChange={e => setAnswer({ ...answer, name: e.target.value })}
                    />
                </EuiFormRow>
            </th>
            <th style={{marginLeft:'10px'}}>
                <EuiFormRow label={titles?.[1]} fullWidth>
                    <EuiFieldText 
                        disabled={editMode} 
                        required={required} 
                        placeholder={placeholders?.[1]}
                        value={answer.surname}
                        onChange={e => setAnswer({ ...answer, surname: e.target.value })}
                    />
                </EuiFormRow>
            </th>
        </tr>
    </table> 
    
});

FullName.displayName = 'FUllName';

export default FullName;