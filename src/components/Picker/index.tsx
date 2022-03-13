import { EuiButton, EuiSelectable, EuiSelectableOption } from '@elastic/eui';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Test } from '../../types/models';
import { translate } from '../../utils';
import styles from './Picker.module.scss';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { STAGE_TYPE } from '../../types/enums';
import capitalize from 'lodash.capitalize';

type ItemOption = EuiSelectableOption<{ name: string; itemID: string; }>;

type PickerOptions = {
	returnBack?: boolean;
	onSelect: (itemID: string) => void;
    itemType: STAGE_TYPE.FORM | STAGE_TYPE.TEST;
}

const itemProps = {
    [STAGE_TYPE.FORM]: {
        getEndpoint: '/api/templates/form',
        builderURL: 'formbuilder',
        createEndpoint: '/api/templates/createForm'
    },
    [STAGE_TYPE.TEST]: {
        getEndpoint: '/api/templates/test',
        builderURL: 'testbuilder',
        createEndpoint: '/api/templates/createTest'
    }
}

type ItemType = Form | Test;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const Picker = ({ returnBack = false, onSelect, itemType }: PickerOptions) => {
    const { getEndpoint, builderURL, createEndpoint } = itemProps[itemType];

    const [templates, setTemplates] = useState([] as ItemType[]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios.get(getEndpoint).then(({ data }) => {
            setTemplates(data as ItemType[]);
        }).finally(() => setLoading(false));
    }, [getEndpoint]);

    const handleTemplateSelect = useCallback((options: ItemOption[]) => {
        const { itemID = '' } = options.find(option => option.checked === 'on') as ItemOption;
        onSelect(itemID);
    }, [onSelect]);

    const goToBuilder = useCallback(itemID => {
        const url = `/${builderURL}/${itemID}`;
        const query = `${returnBack ? `?returnTo=${router.asPath}` : ''}`;
        router.push(url + query, url);
    }, [router, returnBack, builderURL]);

    const handleCreate = useCallback(() => {
        axios.post(createEndpoint).then(({ data: itemID }) => {
            goToBuilder(itemID);
        });
    }, [goToBuilder, createEndpoint]);

    const handlePreview = useCallback(itemID => (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();
        goToBuilder(itemID);
    }, [goToBuilder]);

    const options = useMemo(() => templates.map<ItemOption>(({ _id, name }) => ({
        label: _id,
        name,
        itemID: _id,
        append: <VisibilityIcon onClick={handlePreview(_id)}/>
    })), [templates, handlePreview]);

    return <div className={styles.container}>
        <EuiSelectable
            isLoading={loading}
            searchable
            singleSelection
            className={styles.list}
            height="full"
            listProps={{ paddingSize: 'none', rowHeight: 50, onFocusBadge: false } as any}
            options={options}
            renderOption={({ name }) => <div>{name}</div>}
            onChange={handleTemplateSelect}
        >
            {(list, search) => (
                <Fragment>
                    {search}
                    {list}
                </Fragment>
            )}

        </EuiSelectable>
        <EuiButton
            color='text'
            fullWidth
            onClick={handleCreate}
        >
            {translate(`Create New ${capitalize(itemType)} Template`)}
        </EuiButton>
    </div>;
};

export default Picker;