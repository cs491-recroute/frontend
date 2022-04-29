import { EuiCollapsibleNav, EuiText, EuiButton, EuiFormRow } from '@elastic/eui';
import React, { useCallback, createRef, RefObject, useState } from 'react';
import { getRightPanelStatus, toggleRightPanel, updateQuestionAsync } from '../../../redux/slices/testBuilderSlice';
import { translate } from '../../../utils';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import styles from './RightPanel.module.scss';
import { PROP_EDITORS, ALLOWED_EDITORS } from './constants';
import { Question } from '../../../types/models';
import { PartialRecord } from '../../../types/customs';

const RightPanel = () => {
    const dispatch = useAppDispatch();
    const { status: isOpen, question } = useAppSelector(getRightPanelStatus);
    const editorRefs: PartialRecord<keyof Question, RefObject<{ value: any; }>> = {};

    //for save button feedback
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [isFulfilled, setIsFulfilled] = useState(false);

    const close = useCallback(() => {
        dispatch(toggleRightPanel({ status: false }));
    }, []);

    const handleSave = async() => {
        const newProps = (Object.keys(editorRefs) as Array<keyof Question>).reduce((acc, ref) => {
            return { ...acc, [ref]: editorRefs[ref]?.current?.value };
        }, {});

        const response = await dispatch(updateQuestionAsync({ newProps, questionID: question?._id }));
        setSaveButtonClicked(true);
        setTimeout(setSaveButtonClicked, 2000);
        if(response.type.search('fulfilled') === -1){
            //rejected
            setIsFulfilled(false);
        } else {
            //succesfull
            setIsFulfilled(true);
        }
    }

    if (!question) return null;

    return (
        <EuiCollapsibleNav
            className={styles.container}
            style={{ top: 120 }}
            isOpen={isOpen}
            onClose={close}
            side="right"
            closeButtonPosition="inside"
            ownFocus={false}
        >
            <EuiText className={styles.title}>
                {translate('Question Settings')}
            </EuiText>
            <hr />
            {(Object.keys(question) as Array<keyof Question>).map(key => {
                const Renderer = PROP_EDITORS[key];

                if (!Renderer || !ALLOWED_EDITORS[question.type].includes(key)) return null;

                const newRef = createRef<{ value: any; }>();
                editorRefs[key] = newRef;
                return <div className={styles.propEditor} key={key}>
                    <Renderer ref={newRef} defaultValue={question[key]} />
                </div>;
            })}
            <table>
                <tr>
                    <th className={styles.th}>
                        <EuiFormRow>  
                            <p className={styles.feedbackText1}> {saveButtonClicked && isFulfilled && translate('Saved Succesfully')}</p>
                        </EuiFormRow>
                        <EuiFormRow> 
                            <p className={styles.feedbackText2}> {saveButtonClicked && !isFulfilled && translate('Unseccessful Save')}</p>
                        </EuiFormRow>
                    </th>
                    <th> 
                        <EuiButton onClick={handleSave} className={styles.saveButton}>{translate('Save')}</EuiButton>
                    </th>
                </tr>
            </table>
        </EuiCollapsibleNav>
    )
};

export default RightPanel;