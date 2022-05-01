import { EuiButton, EuiComboBox, EuiComboBoxOptionOption, EuiFieldNumber, EuiFieldText, EuiFormRow, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle } from '@elastic/eui';
import { DeleteForever } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getCurrentFlow, setConditionsOfFlow } from '../../../redux/slices/flowBuilderSlice';
import { getCurrentFlow as getSubmissionsFlow } from '../../../redux/slices/submissionsSlice';
import { FORM_FIELDS, FORM_OPERATIONS, STAGE_TYPE } from '../../../types/enums';
import { ComponentTypes, Condition, Form, Stage, Option } from '../../../types/models';
import { translate } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import styles from './Condition.module.scss';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { getPrettyConditionName } from './utils';

type FieldOption = EuiComboBoxOptionOption<{ name: string; componentID: string; componentType: ComponentTypes; componentOptions: Option[]; }>;
const stringComponents = ["address", "fullName", "header", "longText", "phone", "shortText", "email"];
const dropDownComponents = ["dropDown", "multipleChoice", "singleChoice"];

type ConditionalElementProps = {
    stage: Stage,
    condition?: Condition,
    mode: 'edit' | 'submission'
}

// eslint-disable-next-line complexity
const ConditionElement = ({ stage, condition, mode }: ConditionalElementProps) => {
    const dispatch = useAppDispatch();
    const flow = useAppSelector(mode === 'edit' ? getCurrentFlow : getSubmissionsFlow);
    //General states and functions common for all stage types
    const [isOpen, setIsOpen] = useState(false);
    const [allOperations, setAllOperations] = useState([] as EuiComboBoxOptionOption[]);
    const [selectedOperations, setSelectedOperations] = useState([] as EuiComboBoxOptionOption[]);
    const [value, setValue] = useState('');
    const [error, setError] = useState({
        fieldError: false,
        operationError: false,
        valueError: false,
        fieldErrorMessage: '',
        operationErrorMessage: '',
        valueErrorMessage: ''
    });

    //States for interview and test stage types
    const testOrInterviewOptions = [{ label: 'Total Score' }];

    //Set the selected operation
    const handleOperationSelect = (selectedOpts: EuiComboBoxOptionOption[]) => {
        setSelectedOperations(selectedOpts);
        if (selectedOpts.length !== 0) {
            setError(prevState => ({
                ...prevState,
                operationError: false,
                operationErrorMessage: ''
            }));
        }
    };

    //States and functions for the form stage type
    const [fieldOptions, setFieldOptions] = useState([] as FieldOption[]);
    const [selectedOptions, setSelectedOptions] = useState([] as FieldOption[]);
    const [dropDownOptions, setDropDownOptions] = useState([] as EuiComboBoxOptionOption[]);
    const [selectedDropDownOptions, setSelectedDropDownOptions] = useState([] as EuiComboBoxOptionOption[]);

    //Update dropdown options for operations based on selected form field
    const onChange = (selectedOpts: FieldOption[]) => {
        setSelectedOptions(selectedOpts as FieldOption[]);
        const componentType = selectedOpts[0]?.value?.componentType ? selectedOpts[0].value.componentType : '';
        if (componentType) {
            const arr = FORM_FIELDS[componentType];
            const newOptions = arr.map(e => ({
                label: e
            }));
            setAllOperations(newOptions);
            if (dropDownComponents.includes(selectedOpts[0]?.value?.componentType || '')) {
                const optArray = selectedOpts[0]?.value?.componentOptions ? selectedOpts[0].value.componentOptions : [];
                const componentOptions = optArray.map(e => ({
                    label: e.description,
                    id: e._id
                }));
                setDropDownOptions(componentOptions);
                setSelectedDropDownOptions([]);
            }
            setError(prevState => ({
                ...prevState,
                fieldError: false,
                fieldErrorMessage: ''
            }));
        } else {
            setAllOperations([]);
        }
        setSelectedOperations([]);
    };

    const handleComponentOptionSelect = (selectedOpts: EuiComboBoxOptionOption[]) => {
        setSelectedDropDownOptions(selectedOpts);
        setError(prevState => ({
            ...prevState,
            valueError: false,
            valueErrorMessage: ''
        }));
    }

    const handleDelete = async () => {
        if (!condition?._id) return;
        const { data } = await axios.delete(`/api/flows/${flow._id}/${condition._id}/deleteCondition`);
        dispatch(setConditionsOfFlow(data));
    }

    const handleSaveButton = async () => {
        if ((selectedOperations.length === 1) && value) {
            const body: any = {};
            body.from = stage._id;

            body.operation = selectedOperations[0].label;
            if (stage.type === STAGE_TYPE.FORM && (selectedOptions.length === 1)) {
                const field = (selectedOptions[0]?.value?.componentID);
                body.field = field;
                const componentType = (selectedOptions[0]?.value?.componentType);
                if (stringComponents.includes(componentType || '') || (componentType === ComponentTypes.number)) { //value should be sent as a string or number
                    body.value = value;
                    if (componentType === ComponentTypes.number) body.value = Number(value);
                } else if (componentType === ComponentTypes.singleChoice || componentType === ComponentTypes.dropDown) { // value should be sent as a string
                    const singleChoiceID = selectedDropDownOptions[0].id;
                    body.value = singleChoiceID;
                } else { //
                    const selectedOptionIds = selectedDropDownOptions.map(({ id }) => id);
                    body.value = selectedOptionIds;
                }
            } else { //stage is interview or test
                //body.field = testOrInterviewOptions[0].label;
                body.value = Number(value);
            }
            if (condition) { //condition should be updated
                try {
                    const { data } = await axios.put(`/api/flows/${flow._id}/${condition._id}/updateCondition`, body);
                    dispatch(setConditionsOfFlow(data));
                    toast(translate('Successful'), {
                        type: 'success',
                        position: 'bottom-right',
                        hideProgressBar: true
                    });
                    closeModel();
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                } catch (error: any) {
                    toast(translate(error?.response?.data || 'Error occured!'), {
                        type: 'error',
                        position: 'bottom-right',
                        hideProgressBar: true
                    });
                }
            } else { //condition should be set
                try {
                    const { data } = await axios.post(`/api/flows/${flow._id}/setCondition`, body);
                    dispatch(setConditionsOfFlow(data));
                    toast(translate('Successful'), {
                        type: 'success',
                        position: 'bottom-right',
                        hideProgressBar: true
                    });
                    closeModel();
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                } catch (error: any) {
                    toast(translate(error?.response?.data || 'Error occured!'), {
                        type: 'error',
                        position: 'bottom-right',
                        hideProgressBar: true
                    });
                }
            }

            setError({
                fieldError: false,
                operationError: false,
                valueError: false,
                fieldErrorMessage: '',
                operationErrorMessage: '',
                valueErrorMessage: ''
            });
        }
        if (stage.type === STAGE_TYPE.FORM) {
            if (!(selectedOptions.length === 1)) {
                setError(prevState => ({
                    ...prevState,
                    fieldError: true,
                    fieldErrorMessage: 'Please select the form field'
                }));
            }
        }
        if (!(selectedOperations.length === 1)) {
            setError(prevState => ({
                ...prevState,
                operationError: true,
                operationErrorMessage: 'Please select operation'
            }));
        }
        if (!value) {
            setError(prevState => ({
                ...prevState,
                valueError: true,
                valueErrorMessage: 'Please specify the comparison value'
            }));
        }
    };

    const handleNumberOrTextField = ({ target }: any) => {
        setValue(target.value);
        setError(prevState => ({
            ...prevState,
            valueError: false,
            valueErrorMessage: ''
        }));
    }

    const closeModel = () => {
        setIsOpen(false);
        setAllOperations([]);
        setSelectedOperations([]);
        setValue('');
        setError({
            fieldError: false,
            operationError: false,
            valueError: false,
            fieldErrorMessage: '',
            operationErrorMessage: '',
            valueErrorMessage: ''
        });
        setFieldOptions([]);
        setSelectedOptions([]);
        setDropDownOptions([]);
        setSelectedDropDownOptions([]);
    }

    useEffect(() => {
        if (stage.type === STAGE_TYPE.FORM) {
            const stageAttributes = stage.stageProps as Form;
            const newOptions = stageAttributes.components?.map<FieldOption>(({ name, _id, type, options }) => ({
                label: name,
                value: { name: name, componentID: _id, componentType: type, componentOptions: options },
                disabled: (type === ComponentTypes.datePicker || type === ComponentTypes.upload)
            }));
            setFieldOptions(newOptions);
        } else {
            const arr = FORM_OPERATIONS.NUMBER
            const newOperations = arr.map(e => ({
                label: e
            }));
            setAllOperations(newOperations);
        }
    }, [stage, isOpen]);

    useEffect(() => {
        if (stage.type === STAGE_TYPE.FORM) {
            const stageAttributes = stage.stageProps as Form;
            const fieldComponent = stageAttributes.components.find(component => component._id === condition?.field);
            if (!fieldComponent) return;
            setSelectedOptions([fieldComponent].map<FieldOption>(({ name, _id, type, options }) => ({
                label: name,
                value: { name: name, componentID: _id, componentType: type, componentOptions: options },
                disabled: (type === ComponentTypes.datePicker || type === ComponentTypes.upload)
            })));
            setSelectedOperations([{ label: (condition?.operation) || "" }]);
            if (fieldComponent.type) {
                const arr = FORM_FIELDS[fieldComponent.type];
                const newOptions = arr.map(e => ({
                    label: e
                }));
                setAllOperations(newOptions);
            }

            if (fieldComponent.type === ComponentTypes.dropDown || fieldComponent.type === ComponentTypes.singleChoice) {
                const valueOption = fieldComponent.options.find(option => option._id === value);
                if (!valueOption) return;
                setSelectedDropDownOptions([valueOption].map(e => ({
                    label: e.description,
                    _id: e._id
                })));
            }
            else if (fieldComponent.type === ComponentTypes.multipleChoice) {
                const valueOptions = fieldComponent.options.filter(option => { if (option._id) value.includes(option._id) });
                setSelectedDropDownOptions(valueOptions.map(e => ({
                    label: e.description,
                    _id: e._id
                })));
            }
            else {
                setValue(condition?.value);
            }
        } else {
            setSelectedOperations([{ label: (condition?.operation) || "" }]);
            setValue(condition?.value);
        }
    }, [condition, isOpen]);

    const [prettyConditionName, prettyConditionElement] = getPrettyConditionName(flow, condition);
    return (
        <div className={classNames(styles.container, { [styles.editMode]: mode === 'edit' })}>
            <div className={styles.conditionBox} title={prettyConditionName} onClick={() => mode === 'edit' && setIsOpen(true)}>
                {prettyConditionElement}
            </div>
            {condition && <DeleteForever onClick={handleDelete} className={styles.deleteIcon} />}
            {isOpen ?
                <EuiModal onClose={closeModel} initialFocus='.name' style={{ width: '50vw', height: '50vh', maxWidth: '500px' }}>
                    <EuiModalHeader>
                        <EuiModalHeaderTitle>{translate('Condition')}</EuiModalHeaderTitle>
                    </EuiModalHeader>

                    <EuiModalBody>
                        {(stage.type === STAGE_TYPE.FORM) &&
                            <EuiFormRow
                                isInvalid={error.fieldError}
                                error={error.fieldErrorMessage}
                                label={translate('Form Field')}
                                fullWidth
                            >
                                <EuiComboBox
                                    fullWidth
                                    aria-label="Accessible screen reader label"
                                    placeholder="Select a single option"
                                    singleSelection={{ asPlainText: true }}
                                    options={fieldOptions}
                                    selectedOptions={selectedOptions}
                                    onChange={onChange}
                                />
                            </EuiFormRow>
                        }
                        {(stage.type === STAGE_TYPE.TEST || stage.type === STAGE_TYPE.INTERVIEW) &&
                            <EuiFormRow
                                label={translate('Total Score')}
                                fullWidth
                            >
                                <EuiComboBox
                                    fullWidth
                                    aria-label="Accessible screen reader label"
                                    placeholder="Select a single option"
                                    singleSelection={{ asPlainText: true }}
                                    options={testOrInterviewOptions}
                                    selectedOptions={testOrInterviewOptions}
                                    onChange={() => { }}
                                    isDisabled={true}
                                />
                            </EuiFormRow>}

                        {(selectedOptions[0] || (stage.type === STAGE_TYPE.TEST || stage.type === STAGE_TYPE.INTERVIEW)) && <EuiFormRow
                            isInvalid={error.operationError}
                            error={error.operationErrorMessage}
                            label={translate('Operation')}
                            fullWidth
                        >
                            <EuiComboBox
                                fullWidth
                                aria-label="Accessible screen reader label"
                                placeholder="Select a single option"
                                singleSelection={{ asPlainText: true }}
                                options={allOperations}
                                selectedOptions={selectedOperations}
                                onChange={handleOperationSelect}
                            />
                        </EuiFormRow>}

                        {(stage.type === STAGE_TYPE.TEST || stage.type === STAGE_TYPE.INTERVIEW || (stage.type === STAGE_TYPE.FORM && (selectedOptions[0]?.value?.componentType === "number"))) &&
                            <EuiFormRow
                                isInvalid={error.valueError}
                                error={error.valueErrorMessage}
                                label={translate('Comparison Value')}
                                fullWidth
                            >
                                <EuiFieldNumber
                                    fullWidth
                                    placeholder="Enter the comparison value"
                                    value={value}
                                    onChange={handleNumberOrTextField}
                                    aria-label="Use aria labels when no actual label is in use"
                                />
                            </EuiFormRow>
                        }

                        {stage.type === STAGE_TYPE.FORM && stringComponents.includes(selectedOptions[0]?.value?.componentType || '') &&
                            <EuiFormRow
                                isInvalid={error.valueError}
                                error={error.valueErrorMessage}
                                label={translate('Comparison Value')}
                                fullWidth
                            >
                                <EuiFieldText
                                    fullWidth
                                    placeholder="Enter the comparison value"
                                    value={value}
                                    onChange={handleNumberOrTextField}
                                    aria-label="Use aria labels when no actual label is in use"
                                />
                            </EuiFormRow>
                        }

                        {stage.type === STAGE_TYPE.FORM && dropDownComponents.includes(selectedOptions[0]?.value?.componentType || '') &&
                            <EuiFormRow
                                isInvalid={error.valueError}
                                error={error.valueErrorMessage}
                                label={translate('Comparison Value')}
                                fullWidth
                            >
                                <EuiComboBox
                                    fullWidth
                                    aria-label="Accessible screen reader label"
                                    placeholder="Select a single option"
                                    singleSelection={(selectedOptions[0].value?.componentType !== ComponentTypes.multipleChoice) && { asPlainText: true }}
                                    options={dropDownOptions}
                                    selectedOptions={selectedDropDownOptions}
                                    isClearable={true}
                                    onChange={handleComponentOptionSelect}
                                />
                            </EuiFormRow>
                        }

                    </EuiModalBody>
                    <EuiModalFooter>
                        <EuiButton onClick={handleSaveButton} fill>
                            {translate('Save')}
                        </EuiButton>
                    </EuiModalFooter>
                </EuiModal> : null}
        </div>

    );
};

export default ConditionElement;