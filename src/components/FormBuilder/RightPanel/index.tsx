import { EuiCollapsibleNav, EuiText, EuiButton } from '@elastic/eui';
import React, { useCallback, createRef, RefObject} from 'react';
import { isRightPanelOpen, toggleRightPanel, updateComponentAsync } from '../../../redux/slices/formBuilderSlice';
import { translate } from '../../../utils';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import styles from './RightPanel.module.scss';

import { Component } from '../../../types/models';
import { PROP_EDITORS, ALLOWED_EDITORS } from './constants';
import { PartialRecord } from '../../../types/customs';

const RightPanel = () => {
    const dispatch = useAppDispatch();
    const { status: isOpen, component } = useAppSelector(isRightPanelOpen);
    const editorRefs: PartialRecord<keyof Component, RefObject<{ value: any; }>> = {};

    const close = useCallback(() => {
        dispatch(toggleRightPanel({ status: false }));
    }, []);

    const handleSave = () => {
        console.log(component)
        const newProps = (Object.keys(editorRefs) as Array<keyof Component>).reduce((acc, ref) => {
            return { ...acc, [ref]: editorRefs[ref]?.current?.value };
        }, {});
        dispatch(updateComponentAsync({ newProps, componentID: component?._id}));
    }

    if (!component) return null;    

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
                {translate('Component Settings')}
            </EuiText>
            <hr />
            {(Object.keys(component) as Array<keyof Component>).map(key => {
                const Renderer = PROP_EDITORS[key];

                if (!Renderer || !ALLOWED_EDITORS[component.type].includes(key)) return null;

                const newRef = createRef<{ value: any; }>();
                editorRefs[key] = newRef;
                return <div className={styles.propEditor} key={key}>
                    <Renderer ref={newRef} defaultValue={component[key]}/>
                </div>;
            })}
            <EuiButton onClick={handleSave} className={styles.saveButton}>{translate('Save')}</EuiButton>
        </EuiCollapsibleNav>
    )
};

export default RightPanel;