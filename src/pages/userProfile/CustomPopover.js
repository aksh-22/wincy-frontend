import ErrorIcon from '@mui/icons-material/Error';
import CustomButton from 'components/CustomButton';
import CustomInput from 'components/customInput/CustomInput';
import { useState } from 'react';
import classes from './UserProfile.module.css';

const CustomPopover = ({
    onClose,
    data,
    isLoading,
    onChange,
    selectedValue,
}) => {
    const [search, setSearch] = useState(null);
    const handleSearch = (event) => {
        const { value } = event?.target;
        if (data?.length > 0) {
            if (!value?.trim()?.length) return setSearch(null);

            let result = data?.filter((item) =>
                item?.name?.toLowerCase().includes(value?.toLowerCase())
            );
            setSearch(result);
        }
    };

    return (
        <div className={classes.SelectCustomerPopup_container}>
            <CustomInput
                placeholder={'Search'}
                type='search'
                className={'m-2'}
                onChange={handleSearch}
            />
            <div className={classes.customerList}>
                {search ? (
                    search?.length > 0 ? (
                        search?.map((item, index) => {
                            return (
                                <p
                                    className={`textEllipse ${classes.customerName}`}
                                    onClick={() => {
                                        onChange && onChange(item);
                                        onClose && onClose();
                                    }}
                                >
                                    {item?.name}
                                </p>
                            );
                        })
                    ) : (
                        <div className='my-4'>
                            <div className='assigneeContainerRow alignCenter justifyContent_center'>
                                {' '}
                                <ErrorIcon />{' '}
                                <p style={{ paddingLeft: 5 }}>
                                    No Permission Found
                                </p>
                            </div>
                        </div>
                    )
                ) : (
                    data.map((item, index) => {
                        return (
                            <p
                                className={`textEllipse ${classes.customerName}`}
                                style={{
                                    background:
                                        selectedValue?.id === item?.id
                                            ? 'var(--progressBarColor)'
                                            : 'transparent',
                                }}
                                onClick={() => {
                                    onChange && onChange(item);

                                    onClose && onClose();
                                }}
                            >
                                {item?.name}
                            </p>
                        );
                    })
                )}
            </div>
            <div className='alignCenter justifyContent_end mb-2 mr-2'>
                <CustomButton>
                    <p>Done</p>
                </CustomButton>
            </div>
        </div>
    );
};

export default CustomPopover;
