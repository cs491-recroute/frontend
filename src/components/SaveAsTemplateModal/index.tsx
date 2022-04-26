import { EuiButton, EuiComboBox, EuiComboBoxOptionOption, EuiFieldText, EuiFormRow, EuiModal, EuiModalBody, EuiModalHeader, EuiModalHeaderTitle, EuiSwitch } from '@elastic/eui';
import React, { ChangeEventHandler, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { getCategories, saveAsTemplateAsync } from '../../redux/slices/testBuilderSlice';
import { Question } from '../../types/models';
import { translate } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import styles from './SaveAsTemplateModal.module.scss';

type SaveAsTemplateModalProps = {
    question: Question;
}

type CategoryOption = EuiComboBoxOptionOption<{ name: string; categoryID: string; }>;

export type SaveAsTemplateModalRef = { close: () => void, open: () => void };

const SaveAsTemplateModal = forwardRef<SaveAsTemplateModalRef, SaveAsTemplateModalProps>(({ question }, ref) => {
    const dispatch = useAppDispatch();
    const categoryOptions = useAppSelector(getCategories);
    const [options, setOptions] = useState([] as CategoryOption[]);
    const [selectedOptions, setSelectedOptions] = useState([] as CategoryOption[]);
    const [isOpen, setOpen] = useState(false);
    const [questionName, setQuestionName] = useState(question.name);
    const [sendSuccessful, setSendSuccessful] = useState(false);
    const [sendButtonClicked, setSendButtonClicked] = useState(false);
    const [nameError, setNameError] = useState({
        isError: false,
        errorMessage: ''
    });
    const [categoryError, setCategoryError] = useState({
        isError: false,
        errorMessage: ''
    });
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const newOptions = categoryOptions.map<CategoryOption>(({ _id, name }) => ({
            label: name,
            value: { name: name, categoryID: _id }
        }));
        setOptions(newOptions);
    }, [categoryOptions]);

    const onChange = (selectedOpts: CategoryOption[]) => {
        setSelectedOptions(selectedOpts as CategoryOption[]);
    };

    const handleSaveButton = async () => {
        if (!questionName && !(selectedOptions.length === 1)) {
            setNameError({ isError: true, errorMessage: 'Please enter the name' });
            setCategoryError({ isError: true, errorMessage: 'Please select the category' });
        } else if (!questionName) {
            setNameError({ isError: true, errorMessage: 'Please enter the name' });
            setCategoryError({ isError: false, errorMessage: '' });
        } else if (!(selectedOptions.length === 1)) {
            setCategoryError({ isError: true, errorMessage: 'Please select the category' });
            setNameError({ isError: false, errorMessage: '' });
        } else {
            setNameError({ isError: false, errorMessage: '' });
            setCategoryError({ isError: false, errorMessage: '' });
            const questionData = {...question};
            questionData.name = questionName;
            questionData.categoryID = selectedOptions[0].value?.categoryID ? selectedOptions[0].value?.categoryID : '';
            const allData = {'questionData': questionData,'accessModifier': (checked ? 'public' : 'private')};
            const response = await dispatch(saveAsTemplateAsync(allData));
            setSendButtonClicked(true);
            setTimeout(setSendButtonClicked, 2000);
            if (response.type.search('fulfilled') === -1) {
                //rejected
                setSendSuccessful(false);
            } else {
                //succesfull
                setSendSuccessful(true);
            }
        }
    };

    const close = () => {
        setNameError({ isError: false, errorMessage: '' });
        setCategoryError({ isError: false, errorMessage: '' });
        setQuestionName(question.name);
        setSendSuccessful(false);
        setOpen(false);
    }
    const open = () => {
        setOpen(true);
    }

    useImperativeHandle(ref, () => ({ close, open }));

    return isOpen ?
        <EuiModal onClose={close} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>{translate('Save As Template')}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <EuiFormRow
                    isInvalid={nameError.isError}
                    error={nameError.errorMessage}
                    label={translate('QUESTION NAME')}
                    fullWidth
                >
                    <EuiFieldText
                        value={questionName}
                        placeholder="Enter the question name"
                        fullWidth
                        onChange={event => setQuestionName(event.target.value)}
                    />
                </EuiFormRow>
                <EuiFormRow
                    isInvalid={categoryError.isError}
                    error={categoryError.errorMessage}
                    label={translate('CATEGORY')}
                    fullWidth
                >
                    <EuiComboBox
                        fullWidth
                        aria-label="Accessible screen reader label"
                        placeholder="Select a single option"
                        singleSelection={{ asPlainText: true }}
                        options={options}
                        selectedOptions={selectedOptions}
                        onChange={onChange}

                    />
                </EuiFormRow>
                <EuiFormRow>
                    <EuiSwitch
                        label={checked ? "public" : "private"}
                        checked={checked}
                        onChange={e => setChecked(e.target.checked)}
                    />
                </EuiFormRow>
                <div className={styles.saveButton}>
                    <EuiFormRow>
                        <p className={styles.successfulFeedbackText}>{sendButtonClicked && sendSuccessful && translate('Saved Succesfully')}</p>
                    </EuiFormRow>
                    <EuiFormRow>
                        <p className={styles.feedbackText}>{sendButtonClicked && !sendSuccessful && translate('Unseccessful Save')}</p>
                    </EuiFormRow>
                    <EuiFormRow fullWidth>
                        <EuiButton onClick={handleSaveButton} fill>
                            {translate('Save')}
                        </EuiButton>
                    </EuiFormRow>
                </div>
            </EuiModalBody>
        </EuiModal> : null;
});

SaveAsTemplateModal.displayName = 'SaveAsTemplateModal';

export default SaveAsTemplateModal;