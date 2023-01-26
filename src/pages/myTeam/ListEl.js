import { Avatar, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import CustomSelect from 'components/CustomSelect';
import { useState } from 'react';
import { useEditRoleAndDesignation } from 'react-query/organisations/useEditRoleAndDesignation';
import { useSelector } from 'react-redux';
import styles from './MyTeam.module.css';

import DoneIcon from '@material-ui/icons/Done';
import { ClickAwayListener } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import { errorToast, successToast } from 'utils/toast';
import SLR_Wrapper from 'components/SLR_wrapper/SLR_Wrapper';
import { Link } from 'react-router-dom';
import { textTruncateMore } from 'utils/textTruncate';
const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

let menuItem = ['Member', 'Member+', 'Member++'];

export default function ListEl({ el, name, email, role, designation }) {
    const classes = useStyles();

    const [editableData, setEditableData] = useState({ role, designation });

    const [editState, setEditState] = useState(false);

    const [showDetails, setShowDetails] = useState(false);

    const userType = useSelector(
        (state) => state.userReducer?.userType.userType
    );
    if (userType === 'Admin') {
        menuItem = ['Admin', 'Member', 'Member+', 'Member++'];
    }
    const userId = useSelector(
        (state) => state.userReducer?.userData?.user?._id
    );
    const selectedOrg = useSelector(
        (state) => state.userReducer?.selectedOrganisation
    );
    const orgId = selectedOrg?._id;

    const { isLoading, mutate } = useEditRoleAndDesignation(orgId, el._id);

    const copyDataHandler = (data, text) => {
        if (data) {
            navigator.clipboard.writeText(data);
            successToast(`${text} copied Sucessfully`);
        } else {
            errorToast(`${text} not provided`);
        }
        // data.select();
        // document.execCommand("copy");
    };

    const saveHandler = () => {
        const data =
            editableData.role !== 'Admin'
                ? {
                      orgId,
                      userId: el._id,
                      data: {
                          userType: editableData.role,
                          designation: editableData.designation,
                      },
                  }
                : {
                      orgId,
                      userId: el._id,
                      data: {
                          userType: editableData.role,
                          designation: editableData.designation,
                      },
                  };
        mutate(data, {
            onSuccess: () => {
                setEditState(false);
            },
        });
    };

    const shouldEdit =
        (userType === 'Admin' && role !== 'Admin') ||
        (userType === 'Member++' && role !== 'Admin' && role !== 'Member++');

    const shouldEditDegignation =
        userType === 'Admin' ||
        (userType === 'Member++' && role !== 'Admin' && role !== 'Member++');

    const shouldShowInfo = userType === 'Admin' || userType === 'Member++';

    return (
        <SLR_Wrapper showDownloadButton={false} showThumbnails={false}>
            <ClickAwayListener
                onClickAway={() => {
                    setEditState(false);
                }}
            >
                <div
                    onKeyPress={(e) => e.key === 'Enter' && saveHandler()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        backgroundColor: 'var(--)',
                        height: 'auto',
                    }}
                >
                    <div className={styles.tableElHead}>
                        {name && <p>Team</p>}
                        <p>Mail Id</p>
                        <p>Role</p>
                        {shouldShowInfo && <p>Designation</p>}
                    </div>
                    <div
                        className={
                            shouldShowInfo
                                ? styles.tableEl
                                : styles.tableElLessInfo
                        }
                        style={{
                            backgroundColor: !editState
                                ? 'var(--milestoneRowElColor)'
                                : 'var(--lightGray)',
                            transition: 'all .3s',
                        }}
                        key={el.name + el.email}
                    >
                        <div className={styles.side}></div>
                        {showDetails && (
                            <ClickAwayListener
                                onClickAway={() => {
                                    setShowDetails(false);
                                }}
                            >
                                <div className={styles.bankDetails}>
                                    <p>
                                        Acc No. :
                                        {el?.accountDetails
                                            ? el?.accountDetails?.accountNumber
                                            : 'N/A'}
                                        <LightTooltip title='Copy Acc No.'>
                                            <IconButton
                                                onClick={() =>
                                                    copyDataHandler(
                                                        el?.accountDetails
                                                            ?.accountNumber,
                                                        'Acc No.'
                                                    )
                                                }
                                                style={{
                                                    color: 'var(--defaultWhite)',
                                                }}
                                            >
                                                <FileCopyOutlinedIcon />
                                            </IconButton>
                                        </LightTooltip>
                                    </p>
                                    <p>
                                        IFSC :{' '}
                                        {el?.accountDetails
                                            ? el?.accountDetails?.ifsc
                                            : 'N/A'}
                                        <LightTooltip title='Copy IFSC'>
                                            <IconButton
                                                onClick={() =>
                                                    copyDataHandler(
                                                        el?.accountDetails
                                                            ?.ifsc,
                                                        'ifsc'
                                                    )
                                                }
                                                style={{
                                                    color: 'var(--defaultWhite)',
                                                }}
                                            >
                                                <FileCopyOutlinedIcon />
                                            </IconButton>
                                        </LightTooltip>
                                    </p>
                                </div>
                            </ClickAwayListener>
                        )}
                        {name && (
                            <div className={styles.name}>
                                <Avatar
                                    className={classes.small}
                                    src={el.profilePicture}
                                />
                                <LightTooltip title={name ?? name}>
                                    {['Admin'].includes(userType) ? (
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
                                            <p style={{ marginLeft: '10px' }}>
                                                {textTruncateMore(name, 30) ??
                                                    'user name'}
                                            </p>
                                        </Link>
                                    ) : (
                                        <p style={{ marginLeft: '10px' }}>
                                            {textTruncateMore(name, 30) ??
                                                'user name'}
                                        </p>
                                    )}
                                </LightTooltip>
                            </div>
                        )}
                        {/* <MoreVertIcon className={styles.more} /> */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: 'auto',
                            }}
                        >
                            <LightTooltip title={email ?? email}>
                                <p style={{ marginRight: 10 }}>
                                    {textTruncateMore(email, 30) ??
                                        'user email'}
                                </p>
                            </LightTooltip>
                        </div>
                        <div className={styles.editData}>
                            {editState &&
                            shouldEdit &&
                            shouldEditDegignation ? (
                                <CustomSelect
                                    menuItems={menuItem}
                                    value={editState ? editableData.role : role}
                                    name='userType'
                                    handleChange={(event) => {
                                        setEditableData({
                                            ...editableData,
                                            role: event.target.value,
                                        });
                                        setEditState(true);
                                    }}
                                />
                            ) : (
                                <p
                                    onClick={() => {
                                        shouldEdit && setEditState(true);
                                    }}
                                >
                                    {role}
                                    {/* {mainData.role} */}
                                </p>
                            )}
                        </div>
                        <div className={styles.editData}>
                            {editState &&
                            (shouldEdit || shouldEditDegignation) ? (
                                <TextField
                                    value={
                                        editState
                                            ? editableData.designation
                                            : designation
                                    }
                                    onChange={(event) => {
                                        setEditableData({
                                            ...editableData,
                                            designation: event.target.value,
                                        });
                                    }}
                                />
                            ) : (
                                shouldShowInfo && (
                                    <p
                                        onClick={() => {
                                            (shouldEdit ||
                                                shouldEditDegignation) &&
                                                setEditState(true);
                                        }}
                                    >
                                        {/* {mainData.designation ?? "ND"} */}
                                        {designation ?? 'N/A'}
                                    </p>
                                )
                            )}
                        </div>
                        <div className={`${styles.elIcon} `}>
                            {!isLoading && shouldShowInfo && !editState && (
                                <IconButton
                                    onClick={() => {
                                        setShowDetails(true);
                                    }}
                                    style={{ color: 'var(--defaultWhite)' }}
                                >
                                    <InfoOutlinedIcon />
                                </IconButton>
                            )}
                            {!editState ? (
                                <>
                                    {/* <IconButton
                onClick={() => {
                  removeHandler();
                }}
              >
                <DeleteForeverIcon />
              </IconButton> */}
                                    {(shouldEdit || shouldEditDegignation) && (
                                        <IconButton
                                            onClick={() => {
                                                (shouldEdit ||
                                                    shouldEditDegignation) &&
                                                    setEditState(true);
                                            }}
                                        >
                                            <LightTooltip title='Edit user Details'>
                                                <EditIcon
                                                    style={{
                                                        color: 'var(--defaultWhite)',
                                                    }}
                                                />
                                            </LightTooltip>
                                        </IconButton>
                                    )}
                                </>
                            ) : isLoading ? (
                                <div className={styles.loadingIcon}>
                                    <AutorenewIcon />
                                </div>
                            ) : (
                                <>
                                    <IconButton onClick={saveHandler}>
                                        <DoneIcon
                                            style={{ color: 'var(--primary)' }}
                                        />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setEditState(false);
                                        }}
                                    >
                                        <CancelIcon
                                            style={{ color: 'var(--primary)' }}
                                        />
                                    </IconButton>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        </SLR_Wrapper>
    );
}
