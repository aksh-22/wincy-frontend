import { ClickAwayListener } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CakeIcon from '@material-ui/icons/Cake';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import PhoneIcon from '@material-ui/icons/Phone';
import BtnWrapper from 'components/btnWrapper/BtnWrapper';
import CustomButton from 'components/CustomButton';
import CustomInputAvatar from 'components/CustomInputAvatar/CustomInputAvatar';
import CustomDatePicker from 'components/datePicker/ReactDatePicker';
import TextInput from 'components/textInput/TextInput';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useUpdateUser } from 'react-query/profile/useUpdateUser';
import { useSelector } from 'react-redux';
import { textTruncateMore } from 'utils/textTruncate';
import { errorToast, successToast } from 'utils/toast';
import classes from './MyProfile.module.css';
import PasswordArea from './PasswordArea';

const icons = [
    {
        icon: <InsertInvitationIcon />,
        title: 'Join Date (DD/MM/YYYY)',
        key: 'createdAt',
    },
    { icon: <EmailIcon />, title: 'Email', key: 'email' },
    { icon: <PhoneIcon />, title: 'Phone Number', key: 'phoneNumber' },
    {
        icon: <AccountBalanceIcon />,
        title: 'Account Number',
        key: 'accountNumber',
    },
    { icon: <AccountBalanceWalletIcon />, title: 'IFSC', key: 'ifsc' },
    {
        icon: <CakeIcon />,
        title: 'Birth Date (DD/MM/YYYY)',
        key: 'dateOfBirth',
    },
];

export default function MyProfile() {
    const [activeBtn, setActiveBtn] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [didEditImage, setDidEditImage] = useState(false);

    const [isError, setIsError] = useState({
        name: false,
        phoneNumber: false,
        dateOfBirth: false,
        accountNumber: false,
        ifsc: false,
    });

    const [errorText, setErrorText] = useState({
        name: '',
        phoneNumber: '',
        dateOfBirth: '',
        accountNumber: '',
        ifsc: '',
    });

    const orgId = useSelector(
        (state) => state.userReducer?.selectedOrganisation?._id
    );

    const userData = useSelector((state) => state?.userReducer?.userData?.user);

    let designation;

    userData.userType.forEach((el) => {
        if (el.organisation === orgId) {
            designation = el.userType;
        }
    });

    // const designation = useSelector(
    //   (state) => state?.userReducer?.userType?.userType
    // );

    const [userD, setUserD] = useState({
        ...userData,
        ifsc: userData?.accountDetails?.ifsc,
        accountNumber: userData?.accountDetails?.accountNumber,
    });

    useEffect(() => {
        setUserD({
            ...userData,
            ifsc: userData?.accountDetails?.ifsc,
            accountNumber: userData?.accountDetails?.accountNumber,
        });
    }, [userData]);

    const [userInput, setUserInput] = useState({
        profilePicture: userD?.profilePicture,
        name: userD?.name,
        phoneNumber: userD?.phoneNumber,
        age: userD?.age,
        accountNumber: userD?.accountNumber,
        ifsc: userD?.ifsc,
        dob: userD?.dateOfBirth,
        // profilePicture: undefined,
    });

    const { isLoading, mutate } = useUpdateUser(
        setIsEditMode,
        successToast,
        errorToast
    );

    const inputHandler = (data, key) => {
        if (key === 'phoneNumber') {
            setUserInput({ ...userInput, phoneNumber: data });
        } else if (key === 'dateOfBirth') {
            setUserInput({ ...userInput, dob: data });
        } else if (key === 'accountNumber') {
            setUserInput({ ...userInput, accountNumber: data });
        } else if (key === 'ifsc') {
            setUserInput({ ...userInput, ifsc: data });
        }
    };

    const saveHandler = () => {
        const reg = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;

        if (userInput?.name?.trim()?.length === 0) {
            setIsError({ ...isError, name: true });
            setErrorText({
                ...errorText,
                name: 'Required',
            });
            return;
        }
        // else if (!userInput?.phoneNumber) {
        //   setIsError({ ...isError, phoneNumber: true });
        //   setErrorText({
        //     ...errorText,
        //     phoneNumber: "Required",
        //   });
        //   return;
        // }
        // else if (userInput?.phoneNumber?.trim()?.length === 0) {
        //   setIsError({ ...isError, phoneNumber: true });
        //   setErrorText({
        //     ...errorText,
        //     phoneNumber: "Required",
        //   });
        //   return;
        // }
        else if (
            (userInput?.phoneNumber?.trim()?.length < 10 ||
                userInput?.phoneNumber?.trim()?.length > 10) &&
            userInput?.phoneNumber?.trim()?.length > 0
        ) {
            setIsError({ ...isError, phoneNumber: true });
            setErrorText({
                ...errorText,
                phoneNumber: '10 digit phone no. only',
            });
            return;
        }
        // else if (!userInput?.accountNumber) {
        //   setIsError({ ...isError, accountNumber: true });
        //   setErrorText({
        //     ...errorText,
        //     accountNumber: "Required",
        //   });
        //   return;
        // }
        // else if (userInput?.accountNumber?.trim()?.length === 0) {
        //   setIsError({ ...isError, accountNumber: true });
        //   setErrorText({
        //     ...errorText,
        //     accountNumber: "Required",
        //   });
        //   return;
        // }
        else if (
            (userInput?.accountNumber?.trim()?.length < 10 ||
                userInput?.accountNumber?.trim()?.length > 15) &&
            userInput?.accountNumber?.trim()?.length > 0
        ) {
            setIsError({ ...isError, accountNumber: true });
            setErrorText({
                ...errorText,
                accountNumber: 'account no. range is 10 to 15 digits',
            });
            return;
        }
        // else if (!userInput?.ifsc) {
        //   setIsError({ ...isError, ifsc: true });
        //   setErrorText({
        //     ...errorText,
        //     ifsc: "Required",
        //   });
        //   return;
        // }
        // else if (userInput?.ifsc?.trim()?.length === 0) {
        //   setIsError({ ...isError, ifsc: true });
        //   setErrorText({
        //     ...errorText,
        //     ifsc: "Required",
        //   });
        //   return;
        // }
        else if (
            (userInput?.ifsc?.trim()?.length < 10 ||
                userInput?.ifsc?.trim()?.length > 15) &&
            userInput?.ifsc?.trim()?.length > 0
        ) {
            setIsError({ ...isError, ifsc: true });
            setErrorText({
                ...errorText,
                ifsc: 'IFSC range is 10 to 15 digits',
            });
            if (reg.test(userInput?.ifsc)) {
                setIsError({ ...isError, ifsc: true });
                setErrorText({
                    ...errorText,
                    ifsc: 'enter correct ifsc',
                });
                return;
            }
            return;
        }
        //  else if (!userInput?.dob) {
        //   setIsError({ ...isError, dob: true });
        //   setErrorText({
        //     ...errorText,
        //     dob: "Required",
        //   });
        //   return;
        // }
        else {
            const fd = new FormData();
            fd.append('name', userInput.name);
            didEditImage &&
                fd?.append(
                    'profilePicture',
                    userInput?.profilePicture,
                    userInput?.profilePicture?.name
                );
            userInput?.phoneNumber &&
                fd?.append('phoneNumber', userInput?.phoneNumber);
            userInput?.accountNumber &&
                fd?.append('accountNumber', userInput?.accountNumber);
            userInput?.ifsc && fd?.append('ifsc', userInput?.ifsc);
            userInput?.dob && fd?.append('dob', userInput?.dob);
            mutate(fd);
        }
    };

    return (
        <div className={classes.myProfile}>
            <div className={classes.btnArea}>
                <BtnWrapper>
                    <CustomButton
                        type={activeBtn ? 'contained' : 'text'}
                        onClick={() => setActiveBtn(true)}
                    >
                        <p
                            style={{
                                margin: '5px',
                                // color: activeBtn ? "var(--defaultWhite)" : "var(--primary)",
                            }}
                        >
                            Personal Info
                        </p>
                    </CustomButton>
                    <CustomButton
                        type={!activeBtn ? 'contained' : 'text'}
                        onClick={() => {
                            setActiveBtn(false);
                            setIsEditMode(false);
                        }}
                    >
                        <p
                            style={{
                                margin: '5px',
                                // color: !activeBtn ? "var(--defaultWhite)" : "var(--primary)",
                            }}
                        >
                            Password
                        </p>
                    </CustomButton>
                </BtnWrapper>
            </div>
            <ClickAwayListener
                onClickAway={() => {
                    setIsEditMode(false);
                }}
            >
                <div className={classes.profileArea}>
                    <div className={classes.image}>
                        <CustomInputAvatar
                            onClick={(el) => {
                                setIsEditMode(el);
                            }}
                            input={activeBtn}
                            img={userD.profilePicture}
                            getImage={(img) => {
                                setUserInput({
                                    ...userInput,
                                    profilePicture: img,
                                });
                            }}
                            isEditMode={isEditMode}
                            setDidEditImage={setDidEditImage}
                        />
                    </div>

                    <div className={classes.details}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '80%',
                            }}
                        >
                            <div>
                                {!isEditMode ? (
                                    <p
                                        style={{ fontSize: 20 }}
                                        onClick={() => {
                                            setIsEditMode(true);
                                        }}
                                    >
                                        {textTruncateMore(userD.name, 30)}
                                    </p>
                                ) : (
                                    <TextInput
                                        style={{ fontSize: 20 }}
                                        defaultValue={userD.name}
                                        autoFocus
                                        error={isError.name}
                                        onChange={() =>
                                            setIsError({
                                                ...isError,
                                                name: false,
                                            })
                                        }
                                        helperText={
                                            isError.name && errorText.name
                                        }
                                        onBlur={(el) => {
                                            setUserInput({
                                                ...userInput,
                                                name: el.target.value,
                                            });
                                        }}
                                    />
                                )}
                                <div className={classes.profileTag}>
                                    {/* <p style={{ color: "var(--primary)" }}>Developer</p> */}
                                    {designation && (
                                        <span className={classes.tag}>
                                            {designation}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ cursor: 'pointer' }}>
                                {activeBtn && (
                                    <>
                                        {!isEditMode ? (
                                            <EditIcon
                                                onClick={() => {
                                                    setIsEditMode(true);
                                                }}
                                            />
                                        ) : (
                                            <CancelIcon
                                                onClick={() => {
                                                    setIsEditMode(false);
                                                    setUserD(userD);
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {activeBtn ? (
                            <div
                                className={classes.boxArea}
                                // onKeyPress={(e) => e.key === "Enter" && saveHandler()}
                            >
                                {icons.map((el) => (
                                    <div
                                        className={classes.box}
                                        key={el.key + el.title}
                                        // onClick={() => {
                                        //   (el.key === "phoneNumber" ||
                                        //     el.key === "dateOfBirth" ||
                                        //     el.key === "accountNumber" ||
                                        //     el.key === "ifsc") &&
                                        //     setIsEditMode(true);
                                        // }}
                                    >
                                        <div className={classes.iconWrapper}>
                                            {el.icon}
                                        </div>
                                        <div
                                            style={{ wordBreak: 'break-word' }}
                                        >
                                            <p>{el.title}</p>
                                            {(isEditMode &&
                                                el.key === 'phoneNumber') ||
                                            (isEditMode &&
                                                el.key === 'dateOfBirth') ||
                                            (isEditMode &&
                                                el.key === 'accountNumber') ||
                                            (isEditMode &&
                                                el.key === 'ifsc') ? (
                                                el.key === 'dateOfBirth' ? (
                                                    <CustomDatePicker
                                                        error={isError[el.key]}
                                                        helperText={
                                                            isError[el.key] &&
                                                            errorText[el.key]
                                                        }
                                                        selectedDate={
                                                            userInput.dob ??
                                                            moment(
                                                                new Date()
                                                            ).subtract(
                                                                1,
                                                                'days'
                                                            )
                                                        }
                                                        handleDateChange={(
                                                            date
                                                        ) => {
                                                            setUserInput({
                                                                ...userInput,
                                                                dob: date,
                                                            });
                                                        }}
                                                        maxDate={moment(
                                                            new Date()
                                                        ).subtract(1, 'days')}
                                                    />
                                                ) : (
                                                    <TextInput
                                                        // placeholder="input"
                                                        defaultValue={
                                                            userD[el.key]
                                                        }
                                                        type={
                                                            el.key ===
                                                                'phoneNumber' ||
                                                            el.key ===
                                                                'accountNumber'
                                                                ? 'number'
                                                                : 'text'
                                                        }
                                                        error={isError[el.key]}
                                                        helperText={
                                                            isError[el.key] &&
                                                            errorText[el.key]
                                                        }
                                                        onChange={() =>
                                                            setIsError({
                                                                ...isError,
                                                                [el.key]: false,
                                                            })
                                                        }
                                                        onBlur={(el2) => {
                                                            inputHandler(
                                                                el2.target
                                                                    .value,
                                                                el.key
                                                            );
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (
                                                                el.key ===
                                                                'phoneNumber'
                                                            ) {
                                                                var invalidChars =
                                                                    [
                                                                        '-',
                                                                        '+',
                                                                        'e',
                                                                    ];

                                                                if (
                                                                    invalidChars.includes(
                                                                        e.key
                                                                    )
                                                                ) {
                                                                    e.preventDefault();
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )
                                            ) : el.key === 'dateOfBirth' ||
                                              el.key === 'createdAt' ? (
                                                <p>
                                                    {userD[el.key]
                                                        ? moment(
                                                              userD[el.key]
                                                          ).format('DD/MM/YYYY')
                                                        : 'N/A'}
                                                </p>
                                            ) : (
                                                <p>
                                                    {userD[el.key]
                                                        ? userD[el.key]
                                                        : 'N/A'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <PasswordArea setActiveBtn={setActiveBtn} />
                        )}
                        {isEditMode && activeBtn && (
                            <CustomButton
                                onClick={saveHandler}
                                loading={isLoading}
                            >
                                save
                            </CustomButton>
                        )}
                    </div>
                </div>
            </ClickAwayListener>
        </div>
    );
}
