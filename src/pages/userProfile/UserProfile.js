import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CakeIcon from '@material-ui/icons/Cake';
import EmailIcon from '@material-ui/icons/Email';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import PhoneIcon from '@material-ui/icons/Phone';
import CommonDialog from 'components/CommonDialog';
import CustomButton from 'components/CustomButton';
import CustomInputAvatar from 'components/CustomInputAvatar/CustomInputAvatar';
import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { textTruncateMore } from 'utils/textTruncate';
import GivePermission from './GivePermission';
import classes from './UserProfile.module.css';

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

export default function UserProfile(props) {
    const userData = props.location.state;

    const userType = useSelector((state) => state.userReducer?.userType);
    // const userData = useSelector((state) => state?.userReducer?.userData?.user);
    const [userD, setUserD] = useState({
        ...userData,
        ifsc: userData?.accountDetails?.ifsc,
        accountNumber: userData?.accountDetails?.accountNumber,
    });
    let designation;
    const orgId = useSelector(
        (state) => state.userReducer?.selectedOrganisation?._id
    );
    userData?.userType?.forEach((el) => {
        if (el.organisation === orgId) {
            designation = el.userType;
        }
    });

    console.log('userData', JSON.stringify(userData, null, 2));

    let permissionArr = [];

    if (userData?.permission) {
        Object.keys(userData?.permission)?.forEach((el) => {
            if (el === orgId) {
                permissionArr = userData?.permission[el];
            }
        });
    }

    return (
        <div className={classes.myProfile}>
            <div className={classes.btnArea}></div>
            <div className={classes.profileArea}>
                <div className={classes.image}>
                    <CustomInputAvatar img={userD.profilePicture} />
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
                            <p style={{ fontSize: 20 }}>
                                {textTruncateMore(userD.name, 30)}
                            </p>
                            <div className={classes.profileTag}>
                                {/* <p style={{ color: "var(--primary)" }}>Developer</p> */}
                                {designation && (
                                    <span className={classes.tag}>
                                        {designation}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {userType.userType === 'Admin' && designation !== 'Admin' && (
                        <CommonDialog
                            actionComponent={
                                <CustomButton className={classes.submitButton}>
                                    Permissions
                                </CustomButton>
                            }
                            modalTitle='Give Permission to this user'
                            content={
                                <GivePermission
                                    permission={permissionArr}
                                    userId={userData?._id}
                                />
                            }
                            width='100vw !important'
                            size='xl'
                            className={classes.container}
                            // height={300}
                        />
                    )}
                    <div
                        className={classes.boxArea}
                        // onKeyPress={(e) => e.key === "Enter" && saveHandler()}
                    >
                        {icons.map((el) => (
                            <div
                                className={classes.box}
                                key={el.key + el.title}
                            >
                                <div className={classes.iconWrapper}>
                                    {el.icon}
                                </div>
                                <div style={{ wordBreak: 'break-word' }}>
                                    <p>{el.title}</p>
                                    {el.key === 'dateOfBirth' ||
                                    el.key === 'createdAt' ? (
                                        <p>
                                            {userD[el.key]
                                                ? moment(userD[el.key]).format(
                                                      'DD/MM/YYYY'
                                                  )
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
                </div>
            </div>
        </div>
    );
}
