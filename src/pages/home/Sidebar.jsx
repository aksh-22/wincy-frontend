import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Collapse } from '@mui/material';
import { updatePlayerId } from 'api/notification';
import NewGif from 'assets/images/new.gif';
import clsx from 'clsx';
import CommonDialog from 'components/CommonDialog';
import CustomPopper from 'components/CustomPopper';
import Image from 'components/defaultImage/Image';
import Icon from 'components/icons/IosIcon';
import LeadsIcon from 'components/icons/LeadsIcon';
import ProjectsIcon from 'components/icons/ProjectsIcon';
import OrganizationDialog from 'components/OrganizationDialog';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import { InvoiceFilterContext } from 'context/invoiceFilterContext';
import ProfilePopupCss from 'css/ProfilePopup.module.css';
import { useUserType } from 'hooks/useUserType';
import Announcement from 'pages/announcement/Announcement';
import NewUpdateAvailable from 'pages/announcement/newUpdateAvailable/NewUpdateAvailable';
import SessionExpiredContent from 'pages/auth/SessionExpiredContent';
import Account from 'pages/invoice/account/Account';
import CreateInvoice from 'pages/invoice/createInvoice/CreateInvoice';
import UpdateInvoice from 'pages/invoice/createInvoice/UpdateInvoice';
import Customer from 'pages/invoice/customer/Customer';
import { financialYearArray } from 'pages/invoice/FilterInInvoice';
import Invoice from 'pages/invoice/Invoice';
import SubCompany from 'pages/invoice/subCompany/SubCompany';
import ViewInvoice from 'pages/invoice/viewInvoice/ViewInvoice';
import AddLead from 'pages/my leads/addLead/AddLead';
import MyLeadInfo from 'pages/my leads/myLeadInfo/MyLeadInfo';
import MyLeads from 'pages/my leads/MyLeads';
import MyCalendar from 'pages/myCalendar/MyCalendar';
import MyProfile from 'pages/myProfile/MyProfile';
import MyTeam from 'pages/myTeam/MyTeam';
import MyWork from 'pages/mywork/MyWork';
import TaskBugs from 'pages/projects/bug/TaskBugs';
import ProjectInfo from 'pages/projects/project-info/ProjectInfo';
import Projects from 'pages/projects/Projects';
import SalaryCalculation from 'pages/salaryCalculation/SalaryCalculation';
import UserProfile from 'pages/userProfile/UserProfile';
import React, { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import { useGetNotificationCount } from 'react-query/notification/useGetNotificationCount';
import { useOrganisations } from 'react-query/organisations/useOrganisations';
import { useOrgTeam } from 'react-query/organisations/useOrgTeam';
import { useGetSystemData } from 'react-query/system/useGetSystemData';
import { UseData } from 'react-query/UseData';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { textTruncateMore } from 'utils/textTruncate';
import packageJson from '../../../package.json';
import LandingPage from './landingPage/LandingPage';
import NotificationBell from './notificationBell/NotificationBell';
import ProfileCard from './ProfileDrop';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        background: '#0E0841',
        color: 'white',
        zIndex: 999,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        boxShadow: 'none',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        // marginRight: 36,
        color: 'white',
        // background: 'white',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        color: 'white',
        zIndex: 0,
    },
    drawerOpen: {
        background: '#0E0841',
        color: 'white',

        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
        }),
        borderRight: '1px solid rgba(239, 239, 239, 0.1)',
        // position : "fixed",
        // top:0,
        // left:0,
        // bottom:0,
        zIndex: 4,
    },
    drawerClose: {
        background: '#0E0841',
        color: 'white',

        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
        borderRight: '1px solid rgba(239, 239, 239, 0.1)',
        zIndex: 99,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),

        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
        color: 'white',
        overflowX: 'hidden',
        // overflowY: 'auto',
        height: '100vh',
        background: '#0E0841',
        // position:"relative"
    },
}));

export default function SideBar(props) {
    const [invoiceFilter, setInvoiceFilter] = useState({
        financialYear: financialYearArray[0],
        sortBy: 'asc',
        subsiduary: null,
    });
    useOrganisations();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [selectedListItem, setSelectedListItem] = useState(0);
    const [toolbarName, setToolbarName] = useState('Projects');
    const user = useSelector((state) => state.userReducer?.userData?.user);
    const sessionExpired = useSelector(
        (state) => state.userReducer?.sessionExpired
    );
    const selectedOrg = useSelector(
        (state) => state.userReducer?.selectedOrganisation
    );

    const appVersion = useSelector((state) => state.userReducer?.version);
    const { data: profileData } = UseData();
    const { data: currency } = useGetSystemData('currencies');
    const { data: platforms } = useGetSystemData('platforms');
    const { data: technologies } = useGetSystemData('technologies');

    const orgId = selectedOrg?._id;
    const { refetch } = useGetNotificationCount({ orgId });

    useOrgTeam(orgId);

    const userData = useSelector((state) => state?.userReducer?.userData);

    // One Signal

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        OneSignal.init({
            // appId: "4de7a8f8-af46-4dee-9ad8-8b033fbf0f0d", //dev
            appId: '8335154f-4b68-4caa-8562-27779e22e6f2', //live
            allowLocalhostAsSecureOrigin: true,
        }).then(() => {
            setInitialized(true);
            OneSignal.showSlidedownPrompt().then(() => {
                // do other stuff
                // console.log("Popup Open");
            });
            // OneSignal.getNotificationPermission().then((res) => {
            //   console.log("getNotificationPermission", res);
            // });
            // OneSignal.isPushNotificationsEnabled().then((isEnabled) => {
            //   if (isEnabled) console.log("Push notifications are enabled!");
            //   else {
            //     OneSignal.on("permissionPromptDisplay", function () {
            //       console.log("The prompt displayed");
            //     });
            //     OneSignal.on("popoverShown", function () {
            //       console.log("Slide Prompt Shown");
            //     });

            //   }
            // });

            // OneSignal.on("notificationDisplay", (event) => {
            //   console.error("OneSignal notification displayed:", event);
            // });

            if (navigator.serviceWorker) {
                navigator.serviceWorker.onmessage = (event) => {
                    if (event.data.command === 'notification.displayed') {
                        // console.log("OneSignal notification displayed:", event);

                        refetch();
                    }
                };
            }

            // OneSignal.addListenerForNotificationOpened().then((res) => {
            //   console.log("Clicked on Notification", res);
            // });

            // OneSignal.on("notificationDisplay", (event) => {
            //   console.log("OneSignal notification displayed:", event);
            // });
        });
    }, []);
    useEffect(() => {
        OneSignal.getUserId().then((res) => {
            orgId && res && updatePlayerId({ orgId, playerId: res });
        });
    }, [orgId]);

    useEffect(() => {
        let platformsIds = {};
        let platformsColor = {};
        let technologies_ = {};
        let _currencies = {};
        platforms?.map((item) => {
            platformsIds = {
                ...platformsIds,
                [item?.platform]: item?._id,
            };
            platformsColor = {
                ...platformsColor,
                [item?.platform]: item?.color,
            };
            currency?.map((item) => {
                _currencies = {
                    ..._currencies,
                    [item?.currency]: item?.usdEquivalent,
                };
                return null;
            });
            return null;
        });

        technologies?.map((item) => {
            technologies_ = {
                ...technologies_,
                [item?.technology]: item?.color,
            };
            return null;
        });
        dispatch({
            type: 'SET_USER_DATA',
            payload: {
                ...userData,
                platformIds: platformsIds,
                platforms: platformsColor,
                technologies: technologies_,
                currency: _currencies,
            },
        });
    }, [currency, technologies, platforms]);
    const { userType } = useUserType();
    useEffect(() => {
        dispatch({
            type: 'USER_TYPE',
            payload: userType,
        });
    }, [selectedOrg]);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const history = useHistory();

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const { type } = useSelector((state) => state.organizationModal.orgModal);

    useEffect(() => {
        if (history.location.pathname.includes('mywork')) {
            handleSelectedItem(1);
        }
        if (history.location.pathname.includes('myTeam')) {
            handleSelectedItem(2);
        }
        if (history.location.pathname.includes('myLeads')) {
            handleSelectedItem(3);
        }
        if (history.location.pathname.includes('myCalender')) {
            handleSelectedItem(4);
        }
        if (history.location.pathname.includes('invoice/customer')) {
            handleSelectedItem(5.1);
        } else if (history.location.pathname.includes('invoice/subCompany')) {
            handleSelectedItem(5.2);
        } else if (history.location.pathname.includes('invoice/account')) {
            handleSelectedItem(5.3);
        } else if (history.location.pathname.includes('invoice')) {
            handleSelectedItem(5);
        }
        if (history.location.pathname.includes('calculation')) {
            handleSelectedItem(6);
        }

        if (history.location.pathname.includes('announcement')) {
            handleSelectedItem(7);
        }
        if (history.location.pathname.includes('marketing_projects')) {
            handleSelectedItem(8);
        }
        dispatch({
            type: 'SET_ORG_MODAL',
            payload: {
                type: type,
                visible: false,
            },
        });
    }, []);
    useEffect(() => {
        const url = window.location.href.split('/');
        if (url[url.length - 1] === 'main') {
            setToolbarName('Projects');
            history.push('/main/projects');
        }
    }, []);

    useEffect(() => {
        if (props?.location?.pathname === '/main/projects') {
            setToolbarName('Projects');
            setSelectedListItem(0);
        }
    }, [props?.location?.pathname]);

    const handleSelectedItem = (id) => {
        setSelectedListItem(id);
        if (id === 0) {
            setToolbarName('Projects');
            history.push('/main/projects');
        }
        if (id === 1) {
            setToolbarName('My Work');
            history.push('/main/mywork');
        }
        if (id === 2) {
            setToolbarName('My Team');
            history.push('/main/myTeam');
        }

        if (id === 3) {
            setToolbarName('My Leads');
            history.push('/main/myLeads');
        }
        if (id === 4) {
            setToolbarName('My Calender');
            history.push('/main/myCalender');
        }
        if (id === 5) {
            setToolbarName('Invoice');
            history.push('/main/invoice');
        }
        if (id === 5.1) {
            setToolbarName('Customer');
            history.push('/main/invoice/customer');
        }
        if (id === 5.2) {
            setToolbarName('Sub Company');
            history.push('/main/invoice/subCompany');
        }
        if (id === 5.3) {
            setToolbarName('Account');
            history.push('/main/invoice/account');
        }
        if (id === 6) {
            setToolbarName('Salary Calculator');
            history.push('/main/calculation');
        }
        if (id === 7) {
            setToolbarName('Announcement');
            history.push('/main/announcement');
        }
        if (id === 8) {
            setToolbarName('Marketing Projects');
            history.push('/main/marketing_projects');
        }
    };
    const userEmail = useSelector(
        (state) => state?.userReducer?.userData?.user?.email
    );

    // const sendSelfNotification = () => {
    //   OneSignal.sendSelfNotification(
    //     /* Title (defaults if unset) */
    //     "OneSignal Web Push Notification",
    //     /* Message (defaults if unset) */
    //     "Action buttons increase the ways your users can interact with your notification.",
    //     /* URL (defaults if unset) */
    //     "https://example.com/?_osp=do_not_open",
    //     /* Icon */
    //     "https://onesignal.com/images/notification_logo.png",
    //     {
    //       /* Additional data hash */
    //       notificationType: "news-feature",
    //     },
    //     [
    //       {
    //         /* Buttons */
    //         /* Choose any unique identifier for your button. The ID of the clicked button is passed to you so you can identify which button is clicked */
    //         id: "like-button",
    //         /* The text the button should display. Supports emojis. */
    //         text: "Like",
    //         /* A valid publicly reachable URL to an icon. Keep this small because it's downloaded on each notification display. */
    //         icon: "http://i.imgur.com/N8SN8ZS.png",
    //         /* The URL to open when this action button is clicked. See the sections below for special URLs that prevent opening any window. */
    //         url: "https://example.com/?_osp=do_not_open",
    //       },
    //       {
    //         id: "read-more-button",
    //         text: "Read more",
    //         icon: "http://i.imgur.com/MIxJp1L.png",
    //         url: "https://example.com/?_osp=do_not_open",
    //       },
    //     ]
    //   );
    // };

    return (
        <div className={`${classes.root} drawer_container`}>
            <CssBaseline />
            <AppBar
                position='fixed'
                className={`${clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })} boxShadow`}
            >
                <Toolbar
                    className='px-1'
                    style={
                        {
                            // alignItems:"end"
                        }
                    }
                >
                    <div
                        color='inherit'
                        aria-label='open drawer'
                        // edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                        style={{
                            justifyContent: 'flex-start',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {!open && (
                            <div
                                className='d_flex alignItemEnd'
                                style={{ alignItems: 'baseline' }}
                                onClick={handleDrawerOpen}
                            >
                                <Icon
                                    name='projectLogo'
                                    style={{
                                        width: 85,
                                        cursor: 'pointer',
                                    }}
                                />
                                <p
                                    className='ralewayThinIta1lic'
                                    style={{ color: '#aaa', fontSize: 10 }}
                                >
                                    &nbsp; Beta 0.4.95
                                </p>
                            </div>
                        )}
                    </div>

                    <LightTooltip title='New Updates' arrow>
                        <div
                            className='alignCenter cursorPointer'
                            style={{ position: 'relative' }}
                            onClick={() => {
                                history.push('/main/new_updates');
                            }}
                        >
                            <Icon
                                name='newUpdate2'
                                style={{
                                    height: 40,
                                    width: 50,
                                    marginRight: 10,
                                }}
                            />

                            {packageJson.version !== appVersion && (
                                <img
                                    src={NewGif}
                                    alt='no'
                                    style={{
                                        height: 50,
                                        width: 50,
                                        position: 'absolute',
                                        top: -14,
                                        right: -9,
                                    }}
                                />
                            )}
                        </div>
                    </LightTooltip>
                    <NotificationBell orgId={orgId} />
                    <CustomPopper
                        paperClassName={ProfilePopupCss.paperClass}
                        innerPopper={ProfilePopupCss.popperClassColor}
                        width='auto'
                        value={
                            <>
                                <Image
                                    src={user?.profilePicture}
                                    title={user?.name}
                                    style={{
                                        height: 35,
                                        width: 35,
                                    }}
                                />

                                <div
                                    style={{
                                        marginLeft: 10,
                                        flex: 1,
                                        fontSize: 14,
                                        color: 'var(--defaultWhite)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <LightTooltip
                                            arrow
                                            title={
                                                user?.name?.length > 20
                                                    ? user?.name
                                                    : ''
                                            }
                                        >
                                            <p
                                                style={{
                                                    flex: 1,
                                                    textAlign: 'left',
                                                    width: 'auto',
                                                    whiteSpace: 'nowrap',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {textTruncateMore(
                                                    user?.name,
                                                    30
                                                )}
                                                {userType?.userType && (
                                                    <>
                                                        (
                                                        <span
                                                            style={{
                                                                flex: 1,
                                                                textAlign:
                                                                    'left',
                                                                fontSize: 12,
                                                                color: 'var(--primary)',
                                                                marginTop:
                                                                    '-1px',
                                                            }}
                                                            className={
                                                                ProfilePopupCss.textEllipse
                                                            }
                                                        >
                                                            {userType?.userType}
                                                        </span>
                                                        )
                                                    </>
                                                )}
                                            </p>
                                        </LightTooltip>

                                        <ArrowDropDownIcon />
                                    </div>
                                    {/* <LightTooltip arrow 
                   title={userType?.userType?.length > 20 ? userType?.userType  : ""}
                  >
                   
                  </LightTooltip> */}
                                    <LightTooltip
                                        arrow
                                        title={
                                            selectedOrg?.name?.length > 24
                                                ? selectedOrg?.name
                                                : ''
                                        }
                                    >
                                        <p
                                            style={{
                                                textAlign: 'left',
                                                fontSize: 11,
                                            }}
                                            className={
                                                ProfilePopupCss.textEllipse
                                            }
                                        >
                                            {selectedOrg?.name}
                                        </p>
                                    </LightTooltip>
                                </div>
                            </>
                        }
                        valueStyle={{
                            display: 'flex',
                            fontSize: 14,
                            color: 'white',
                            margin: '0px 20px',
                        }}
                        content={<ProfileCard />}
                    />
                </Toolbar>
            </AppBar>
            <Drawer
                variant='permanent'
                className={`${clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })} boxShadow`}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'center',
                            }}
                            // <div className="d_flex alignItemEnd" style={{alignItems:"baseline"}}>
                        >
                            {/* <img src={pairroxz_logo} alt="img" /> */}
                            <Icon
                                name='projectLogo'
                                style={{
                                    width: '45%',
                                }}
                            />
                            <p
                                className='ralewayThinIta1lic'
                                style={{
                                    color: '#aaa',
                                    fontSize: 10,
                                    marginTop: 5,
                                }}
                            >
                                &nbsp; Beta 0.4.95
                            </p>
                            {/* <p style={{ marginLeft: "1rem", fontSize: "1rem" }}>Workspace</p> */}
                        </div>
                    </div>
                    <IconButton
                        onClick={handleDrawerClose}
                        style={{
                            border: '1px solid var(--primary)',
                            padding: 0,
                        }}
                    >
                        <ChevronLeftIcon
                            color='primary'
                            style={{ fontSize: 30 }}
                        />
                    </IconButton>
                </div>
                <Divider />
                <List
                    className='mt-1'
                    style={{
                        fontFamily: 'Lato-Regular !important',
                    }}
                >
                    <LightTooltip title='Projects' arrow placement='right'>
                        <ListItem
                            button
                            onClick={() => handleSelectedItem(0)}
                            className={`${
                                selectedListItem === 0
                                    ? 'activeIconColor'
                                    : 'inActiveIconColor'
                            } `}
                        >
                            <ListItemIcon>
                                {/* <InboxIcon /> */}
                                <ProjectsIcon />
                            </ListItemIcon>
                            <ListItemText primary='Projects' />
                        </ListItem>
                    </LightTooltip>
                    {(['Admin', 'Member++'].includes(userType?.userType) ||
                        profileData?.user?.permission?.[orgId]?.includes(
                            'MARKETING'
                        )) && (
                        <LightTooltip
                            title='Marketing Projects'
                            arrow
                            placement='right'
                        >
                            <ListItem
                                button
                                onClick={() => handleSelectedItem(8)}
                                className={`${
                                    selectedListItem === 8
                                        ? 'activeIconColor'
                                        : 'inActiveIconColor'
                                } `}
                            >
                                <ListItemIcon>
                                    {/* <InboxIcon /> */}
                                    {/* <ProjectsIcon /> */}
                                    <Icon
                                        name={'marketing'}
                                        style={{ height: 28, width: 28 }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary='Marketing Projects' />
                            </ListItem>
                        </LightTooltip>
                    )}

                    {userType.userType && (
                        <>
                            {/* <LightTooltip title="My Work" arrow placement="right">
                <ListItem
                  button
                  onClick={() => handleSelectedItem(1)}
                  className={`${
                    selectedListItem === 1
                      ? "activeIconColor"
                      : "inActiveIconColor"
                  } `}
                >
                  <ListItemIcon>
                    <MyWorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Work" />
                </ListItem>
              </LightTooltip> */}

                            {['Admin', 'Member++', 'Member'].includes(
                                userType?.userType
                            ) && (
                                <LightTooltip
                                    title='Teams'
                                    arrow
                                    placement='right'
                                >
                                    <ListItem
                                        button
                                        onClick={() => handleSelectedItem(2)}
                                        className={`${
                                            selectedListItem === 2
                                                ? 'activeIconColor'
                                                : 'inActiveIconColor'
                                        } `}
                                    >
                                        <ListItemIcon>
                                            <Icon
                                                name='team'
                                                style={{
                                                    fill: '#FFF',
                                                    height: 28,
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary='Teams' />
                                    </ListItem>
                                </LightTooltip>
                            )}

                            {(userType?.userType === 'Admin' ||
                                userEmail === 'info@pairroxz.com') && (
                                <LightTooltip
                                    title='Salary Calculator'
                                    arrow
                                    placement='right'
                                >
                                    <ListItem
                                        button
                                        onClick={() => handleSelectedItem(6)}
                                        className={`${
                                            selectedListItem === 6
                                                ? 'activeIconColor'
                                                : 'inActiveIconColor'
                                        } `}
                                    >
                                        <ListItemIcon>
                                            <Icon name='calculator' />
                                        </ListItemIcon>
                                        <ListItemText primary='Calculator' />
                                    </ListItem>
                                </LightTooltip>
                            )}
                            {(userType.userType === 'Admin' ||
                                userType.userType === 'Member++') && (
                                <LightTooltip
                                    title='Leads'
                                    arrow
                                    placement='right'
                                >
                                    <ListItem
                                        button
                                        onClick={() => handleSelectedItem(3)}
                                        className={`${
                                            selectedListItem === 3
                                                ? 'activeIconColor'
                                                : 'inActiveIconColor'
                                        } `}
                                    >
                                        <ListItemIcon>
                                            <LeadsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Leads' />
                                    </ListItem>
                                </LightTooltip>
                            )}
                            <LightTooltip
                                title='Announcement'
                                arrow
                                placement='right'
                            >
                                <ListItem
                                    button
                                    onClick={() => handleSelectedItem(7)}
                                    className={`${
                                        selectedListItem === 7
                                            ? 'activeIconColor'
                                            : 'inActiveIconColor'
                                    } `}
                                >
                                    <ListItemIcon>
                                        <Icon
                                            name='announcement'
                                            style={{
                                                fill: '#FFF',
                                                height: 25,
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary='Announcement' />
                                </ListItem>
                            </LightTooltip>
                            <LightTooltip
                                title='Calender'
                                arrow
                                placement='right'
                            >
                                <ListItem
                                    button
                                    onClick={() => handleSelectedItem(4)}
                                    className={`${
                                        selectedListItem === 4
                                            ? 'activeIconColor'
                                            : 'inActiveIconColor'
                                    } `}
                                >
                                    <ListItemIcon>
                                        <DateRangeOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Calender' />
                                </ListItem>
                            </LightTooltip>
                        </>
                    )}

                    {(['Admin'].includes(userType?.userType) ||
                        profileData?.user?.permission?.[orgId]?.includes(
                            'CREATE_INVOICE'
                        ) ||
                        profileData?.user?.permission?.[orgId]?.includes(
                            'GET_INVOICES'
                        )) && (
                        <>
                            <LightTooltip
                                title='Invoice'
                                arrow
                                placement='right'
                            >
                                <ListItem
                                    button
                                    onClick={() => handleSelectedItem(5)}
                                    className={`${
                                        selectedListItem === 5 ||
                                        (selectedListItem > 5 &&
                                            selectedListItem < 6)
                                            ? 'activeIconColor'
                                            : 'inActiveIconColor'
                                    } `}
                                >
                                    <ListItemIcon>
                                        <ReceiptIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Invoice' />
                                </ListItem>
                            </LightTooltip>
                            {['Admin'].includes(userType?.userType) ? (
                                <Collapse
                                    in={open}
                                    timeout='auto'
                                    unmountOnExit
                                >
                                    <List
                                        component='div'
                                        style={
                                            {
                                                // paddingLeft: 80,
                                            }
                                        }
                                        disablePadding
                                    >
                                        <ListItem
                                            button
                                            onClick={() =>
                                                handleSelectedItem(5.1)
                                            }
                                            className={` ${
                                                selectedListItem === 5.1
                                                    ? 'activeIconColor'
                                                    : 'inActiveIconColor'
                                            } `}
                                            style={{
                                                padding: '0 0 0 80px',
                                            }}
                                        >
                                            <ListItemIcon
                                                style={{
                                                    minWidth: 30,
                                                }}
                                                className='pr-0'
                                            >
                                                <Icon
                                                    name='arrow'
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        fill: '#FFF',
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary='Customer' />
                                        </ListItem>

                                        <ListItem
                                            button
                                            onClick={() =>
                                                handleSelectedItem(5.2)
                                            }
                                            className={` ${
                                                selectedListItem === 5.2
                                                    ? 'activeIconColor'
                                                    : 'inActiveIconColor'
                                            } `}
                                            style={{
                                                padding: '0 0 0 80px',
                                            }}
                                        >
                                            <ListItemIcon
                                                style={{
                                                    minWidth: 30,
                                                }}
                                                className='pr-0'
                                            >
                                                <Icon
                                                    name='arrow'
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        fill: '#FFF',
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary='Sub Company' />
                                        </ListItem>

                                        <ListItem
                                            button
                                            onClick={() =>
                                                handleSelectedItem(5.3)
                                            }
                                            className={`${
                                                selectedListItem === 5.3
                                                    ? 'activeIconColor'
                                                    : 'inActiveIconColor'
                                            } `}
                                            style={{
                                                padding: '0 0 0 80px',
                                            }}
                                        >
                                            <ListItemIcon
                                                style={{
                                                    minWidth: 30,
                                                }}
                                                className='pr-0'
                                            >
                                                <Icon
                                                    name='arrow'
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        fill: '#FFF',
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary='Account' />
                                        </ListItem>
                                    </List>
                                </Collapse>
                            ) : null}
                        </>
                    )}

                    {/* <ListItem
            button
            onClick={() => handleSelectedItem(3)}
            className={`${selectedListItem === 3 ? 'activeIconColor' : 'inActiveIconColor'
              } `}
          >
            <ListItemIcon>
              <PermIdentityIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem> */}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {!props?.location?.pathname.includes('main/new_user') &&
                    !props?.location?.pathname.includes('invoice') && (
                        <div className='d_flex alignCenter px-2 pt-2'>
                            <HomeOutlinedIcon
                                onClick={() => history.push('/')}
                                style={{
                                    fontSize: 16,
                                    color: 'var(--red)',
                                    cursor: 'pointer',
                                }}
                            />
                            <p
                                style={{
                                    fontSize: 14,
                                    color: 'var(--lightBlue)',
                                    fontFamily: 'Raleway-Regular',
                                }}
                            >
                                /
                                {props?.location?.pathname.includes(
                                    'marketing_projects'
                                ) ? (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push(
                                                '/main/marketing_projects'
                                            )
                                        }
                                    >
                                        Marketing Projects
                                    </span>
                                ) : props?.location?.pathname.includes(
                                      'projects'
                                  ) ? (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/projects')
                                        }
                                    >
                                        Projects
                                    </span>
                                ) : null}
                                {props?.location?.pathname.includes(
                                    'mywork'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/mywork')
                                        }
                                    >
                                        My Work
                                    </span>
                                )}
                                {(props?.location?.pathname.includes(
                                    'myTeam'
                                ) ||
                                    props?.location?.pathname.includes(
                                        'UserProfile'
                                    )) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/myTeam')
                                        }
                                    >
                                        My Team
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'myLead'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/myLeads')
                                        }
                                    >
                                        My Leads
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'addLead'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/myLeads')
                                        }
                                    >
                                        My Leads
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'myCalender'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/myCalender')
                                        }
                                    >
                                        My Calender
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'calculation'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/calculation')
                                        }
                                    >
                                        Salary Calculator
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'myProfile'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/myProfile')
                                        }
                                    >
                                        My Profile
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'announcement'
                                ) && (
                                    <span
                                        className='rootHover'
                                        onClick={() =>
                                            history.push('/main/announcement')
                                        }
                                    >
                                        Announcement
                                    </span>
                                )}
                                {props?.location?.pathname.includes(
                                    'new_updates'
                                ) && (
                                    <span
                                        className='rootHover'
                                        // onClick={() => history.push("/main/new_updates")}
                                    >
                                        New Update
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                {
                    props?.location?.pathname.includes('main/new_user') && (
                        <LandingPage />
                    )
                    //  <div
                    //  onClick={() => history.push("/main/projects")}>Welcome </div>
                }
                <Switch>
                    <Route path='/main/projects/:id' component={ProjectInfo} />
                    <Route
                        path='/main/task/projects/:projectId/:taskId'
                        component={TaskBugs}
                        exact
                    />
                    <Route
                        path='/main/projects'
                        render={(props) => (
                            <Projects projectType='DEVELOPMENT' {...props} />
                        )}
                        exact
                    />

                    <Route
                        path='/main/marketing_projects'
                        exact
                        render={(props) => (
                            <Projects projectType='MARKETING' {...props} />
                        )}
                    />
                    <Route path='/main/mywork' component={MyWork} exact />
                    <Route path='/main/myTeam' component={MyTeam} exact />
                    <Route path='/main/myProfile' component={MyProfile} exact />
                    <Route
                        path='/main/UserProfile'
                        component={UserProfile}
                        exact
                    />
                    <Route path='/main/myLead/:leadId' component={MyLeadInfo} />
                    <Route path='/main/myLeads' component={MyLeads} exact />
                    <Route path='/main/addLead' component={AddLead} exact />
                    <Route
                        path='/main/myCalender'
                        component={MyCalendar}
                        exact
                    />
                    <Route
                        path='/main/calculation'
                        component={SalaryCalculation}
                        exact
                    />
                    <Route
                        path='/main/announcement'
                        component={Announcement}
                        exact
                    />
                    <Route
                        path='/main/new_updates'
                        component={NewUpdateAvailable}
                        exact
                    />

                    {/* {console.log({ profileData })} */}

                    {(['Admin'].includes(userType?.userType) ||
                        profileData?.user?.permission?.[orgId]?.includes(
                            'CREATE_INVOICE'
                        ) ||
                        profileData?.user?.permission?.[orgId]?.includes(
                            'GET_INVOICES'
                        )) && (
                        <>
                            <InvoiceFilterContext.Provider
                                value={{
                                    filter: invoiceFilter,
                                    setFilter: setInvoiceFilter,
                                }}
                            >
                                <Route
                                    path='/main/invoice'
                                    component={Invoice}
                                    exact
                                />
                                {['Admin'].includes(userType?.userType) ? (
                                    <>
                                        {' '}
                                        <Route
                                            path='/main/invoice/customer'
                                            component={Customer}
                                            exact
                                        />
                                        <Route
                                            path='/main/invoice/subCompany'
                                            component={SubCompany}
                                            exact
                                        />
                                        <Route
                                            path='/main/invoice/account'
                                            component={Account}
                                            exact
                                        />{' '}
                                    </>
                                ) : null}
                                <Route
                                    path='/main/invoice/createInvoice'
                                    component={CreateInvoice}
                                    exact
                                />
                                <Route
                                    path='/main/invoice/updateInvoice'
                                    component={UpdateInvoice}
                                    exact
                                />
                                <Route
                                    path='/main/invoice/viewInvoice/:invoiceId'
                                    component={ViewInvoice}
                                    exact
                                />
                            </InvoiceFilterContext.Provider>
                        </>
                    )}
                </Switch>
            </main>
            <OrganizationDialog />
            {sessionExpired && (
                <CommonDialog
                    shouldOpen={sessionExpired}
                    hideCloseIcon
                    minWidth={'25%'}
                    // height={"90%"}
                    content={<SessionExpiredContent />}
                    modalTitle='Session Expired !'
                    // OtherClose={OtherClose}
                />
            )}
        </div>
    );
}
