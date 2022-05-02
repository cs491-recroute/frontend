import React from 'react';
import { OPERATION_DESCRIPTIONS, STAGE_TYPE } from '../../../types/enums';
import { Flow, Stage } from '../../../types/models';
import { ComponentTypes } from '../../../types/models';

export const getPrettyConditionName = (flow: Flow, condition: any) => {
    if (!condition || !flow) return ['', null] as const;

    const stage = flow.stages.find((e: Stage) => e._id === condition.from);
    if (!stage) return ['', null] as const; 

    let fieldName = 'Score';
    let valueName = condition.value;
    if (stage.type === STAGE_TYPE.FORM) {
        const component = stage.stageProps.components.find((e: any) => e._id === condition.field);
        if (!component) return ['', null] as const;
        fieldName = component.name || 'Unnamed Component';

        const valueAsFieldComponents = [ComponentTypes.dropDown, ComponentTypes.singleChoice];
        if (valueAsFieldComponents.includes(component.type)) {
            const { options = [] } = component;
            valueName = options.find((e: any) => e._id === condition.value)?.description || 'Unnamed Option';
        }
        if(component.type === ComponentTypes.multipleChoice) {
            const { options = [] } = component;
            let x = options.filter((e: any) => condition.value.includes(e._id));
            x = x.map((e: any) => e.description);
            valueName = x.join(' & ');
        }
    }

    return [
        `${fieldName} ${OPERATION_DESCRIPTIONS[(condition.operation) as keyof typeof OPERATION_DESCRIPTIONS]} ${valueName}`,
        <span key={condition._id}>
            <b>{fieldName}</b>
            {' '}
            {OPERATION_DESCRIPTIONS[(condition.operation) as keyof typeof OPERATION_DESCRIPTIONS]}
            {' '}
            <b>{valueName}</b>
        </span>
    ] as const;
};