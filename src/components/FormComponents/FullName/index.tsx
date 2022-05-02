import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import styles from './FullName.module.scss';
import { translate } from '../../../utils';

type FullNameProps = {
    required?: boolean;
    titles?: string[];
    placeholders?: string[];
    editMode?: boolean;
}

const FullName = forwardRef(({ required, titles, placeholders, editMode }: FullNameProps, ref) => {
    const [answer, setAnswer] = useState({ name: '', surname: '' });
    const [nameError, setNameError] = useState(false);
    const [surnameError, setSurnameError] = useState(false);

    const triggerError = () => {
        if (!answer.name) {
            setNameError(true);
        } else {
            setSurnameError(true);
        }
    }

    useImperativeHandle(ref, () => ({ answer, invalid: required && (!answer.name || !answer.surname), triggerError }));

    const handleChange = ({ target: { value, name } }: any) => {
        setAnswer({ ...answer, [name]: value });
        if (name === 'name') {
            setNameError(!!required && !value);
        } else {
            setSurnameError(!!required && !value);
        }
    };

    return <div className={styles.container}>
        <EuiFormRow
            label={titles?.[0]}
            fullWidth
            isInvalid={nameError}
            error={translate('This field is required')}
        >
            <EuiFieldText
                name="name"
                disabled={editMode}
                required={nameError}
                placeholder={placeholders?.[0]}
                value={answer.name}
                fullWidth
                onChange={handleChange}
                onBlur={handleChange}
            />
        </EuiFormRow>
        <EuiFormRow
            label={titles?.[1]}
            fullWidth
            isInvalid={surnameError}
            error={translate('This field is required')}
        >
            <EuiFieldText
                name="surname"
                disabled={editMode}
                required={surnameError}
                placeholder={placeholders?.[1]}
                value={answer.surname}
                onChange={handleChange}
                onBlur={handleChange}
            />
        </EuiFormRow>
    </div>

});

FullName.displayName = 'FUllName';

export default FullName;