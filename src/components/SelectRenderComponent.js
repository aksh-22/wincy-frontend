import React from 'react';
import { capitalizeFirstLetter } from 'utils/textTruncate';

function SelectRenderComponent({
    item,
    selected,
    objectKey,
    placeholder,
    isPlaceholder,
}) {
    selected &&
        placeholder === 'Select Project' &&
        console.log('Select Project', { item });
    return isPlaceholder ? (
        <div className={`normalFont d_flex alignCenter textEllipse`}>
            <p
                className='pl-1 textEllipse'
                style={{
                    color: '#757575',
                    fontSize: 13,
                }}
            >
                {capitalizeFirstLetter(placeholder)}
            </p>
        </div>
    ) : selected ? (
        Array.isArray(item) ? (
            <div
                className={`normalFont d_flex alignCenter textEllipse`}
                // style={{color:}}
            >
                <p className='textEllipse'>
                    {item
                        ?.map((row) =>
                            capitalizeFirstLetter(
                                objectKey ? row?.[objectKey] : row?.title
                            )
                        )
                        .join(' , ')}
                </p>
            </div>
        ) : (
            <div
                className={`normalFont d_flex alignCenter textEllipse`}
                // style={{color:}}
            >
                <p className='textEllipse'>
                    {capitalizeFirstLetter(
                        objectKey ? item?.[objectKey] : item?.title
                    )}
                </p>
            </div>
        )
    ) : (
        <div className={`normalFont d_flex alignCenter textEllipse`}>
            <p className='pl-1 textEllipse'>
                {' '}
                {capitalizeFirstLetter(
                    objectKey ? item?.[objectKey] : item?.title
                )}
            </p>
        </div>
    );
}

export default SelectRenderComponent;
