import CustomChip from 'components/CustomChip';
import Image from 'components/defaultImage/Image';
import { useEffect, useState } from 'react';
import { useOrgTeam } from 'react-query/organisations/useOrgTeam';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import { capitalizeFirstLetter, textTruncateMore } from 'utils/textTruncate';
import ListEl from './ListEl';
import styles from './MyTeam.module.css';

const colorArray = [
    'var(--red)',
    'var(--progressBarColor)',
    'var(--primary)',
    'var(--green)',
    '#775CC3',
    '#686868',
    '#0098EB',
    '#FFB300',
    '#02CD79',
    '#B6BAD5',
    'var(--chipYellow)',
    'var(--chipPink)',
    'var(--chipRed)',
];

const permission_data = [
    { id: 1, name: 'CREATE INVOICE', value: 'CREATE_INVOICE' },
    { id: 2, name: 'GET INVOICES', value: 'GET_INVOICES' },
    { id: 3, name: 'GIVE PERMISSION', value: 'GIVE_PERMISSION' },
    { id: 4, name: 'BASIC USER', value: 'BASIC_USER' },
    { id: 5, name: 'ADMIN USER', value: 'ADMIN_USER' },
];

export default function TeamTable({
    sidebarHandler,
    search,
    setSearch,
    showProjectName,
}) {
    const selectedOrg = useSelector(
        (state) => state.userReducer?.selectedOrganisation
    );
    const { push } = useHistory();
    const [searchData, setSearchData] = useState(null);
    const userId = useSelector((state) => state.userReducer?.userType?.userId);

    const userType = useSelector(
        (state) => state.userReducer?.userType.userType
    );

    const orgId = selectedOrg?._id;

    const { isLoading, data } = useOrgTeam(orgId);

    const shouldShowInfo = userType === 'Admin' || userType === 'Member++';
    const showListEl = (value) =>
        value?.users?.map((el, i) => {
            let role;
            let designation;
            el.userType.forEach((el) => {
                if (el.organisation === orgId) {
                    role = el.userType;
                    designation = el.designation;
                    return;
                }
            });
            return showProjectName ? (
                <div
                    className=''
                    style={{
                        background: 'var(--milestoneRowElColor)',
                        flex: 'wrap',
                        display: 'flex',
                        minHeight: 40,
                        borderBottom: '1px solid var(--divider)',
                    }}
                    key={el.name + el.email}
                >
                    <div
                        style={{
                            width: 5,
                            minHeight: 40,
                            background: 'var(--primary)',
                            marginRight: 5,
                        }}
                    />

                    <div className='alignCenter flex'>
                        <div
                            style={{
                                flex: 0.2,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                src={el?.profilePicture}
                                title={el?.name}
                                className='mr-1'
                                placeHolderClassName='mr-1'
                            />

                            {['Admin', 'Member++'].includes(userType) ? (
                                <Link
                                    to={{
                                        pathname: `/main/${
                                            userId === el?._id
                                                ? 'myProfile'
                                                : 'UserProfile'
                                        }`,
                                        state: el,
                                    }}
                                >
                                    <p>
                                        {capitalizeFirstLetter(
                                            textTruncateMore(el?.name, 30) ??
                                                'user name'
                                        )}
                                    </p>
                                </Link>
                            ) : (
                                <p>
                                    {capitalizeFirstLetter(
                                        textTruncateMore(el?.name, 30) ??
                                            'user name'
                                    )}
                                </p>
                            )}
                            {/* <p
              
            >
              {capitalizeFirstLetter(el?.name)}
            </p> */}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                columnGap: 5,
                                rowGap: 5,
                                flexWrap: 'wrap',
                                padding: '10px 0',
                                flex: 0.8,
                                gridGap: 5,
                                gap: 5,
                            }}
                        >
                            {el?.projects.map((value, index) => (
                                <CustomChip
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    handleClick={() =>
                                        push(`/main/projects/${value?._id}`)
                                    }
                                    key={value?._id}
                                    label={capitalizeFirstLetter(value?.title)}
                                    bgColor={
                                        colorArray[
                                            Math.floor(
                                                Math.random() *
                                                    colorArray?.length
                                            )
                                        ]
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <ListEl
                    el={el}
                    sidebarHandler={sidebarHandler}
                    name={el.name}
                    email={el.email}
                    role={role}
                    designation={designation}
                    key={el.name + el.email}
                    showProjectName={showProjectName}
                />
            );
        });

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    const handleSearch = (value) => {
        // const value = search
        if (!value?.trim()?.length) {
            setSearchData(null);
            return setSearch(null);
        }

        let result = data?.users?.filter((item) =>
            item?.name?.toLowerCase().includes(value?.toLowerCase())
        );

        setSearchData({
            users: result,
        });
    };

    return (
        <div className={styles.tableArea}>
            <div
                className={
                    shouldShowInfo ? styles.tableHead : styles.tableHeadLessInfo
                }
            >
                <p>Team</p>

                {showProjectName ? (
                    <p>Project Name</p>
                ) : (
                    <>
                        <p>Mail Id</p>
                        <p>Role</p>
                        {shouldShowInfo && <p>Designation</p>}
                    </>
                )}
            </div>

            {isLoading ? (
                <TableRowSkeleton count={7} height={50} />
            ) : search === null ? (
                showListEl(data)
            ) : (
                showListEl(searchData)
            )}
        </div>
    );
}
