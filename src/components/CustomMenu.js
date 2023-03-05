import React, { memo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector } from 'react-redux';
import { LightTooltip } from './tooltip/LightTooltip';
import Icon from 'components/icons/IosIcon';
import { Checkbox } from '@material-ui/core';
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        fontSize: 10,
    },
})((props) => (
    <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
                fontSize: 14,
            },
        },
        fontSize: 10,
    },
}))(MenuItem);

function CustomMenu({
    menuItems,
    handleMenuClick,
    activeMenuItem,
    id,
    mutate,
    disabled,
    name,
    multiple,
    menuName,
    className,
    actionButton,
    style,
}) {
    const platforms = useSelector(
        (state) => state.userReducer?.userData?.platforms
    );

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSelected, setIsSelected] = useState(
        Array.isArray(activeMenuItem)
            ? [...(activeMenuItem ? activeMenuItem : [])]
            : []
    );
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (item, outside) => {
        item?.value === 'Completed'
            ? setIsCompleted(true)
            : setIsCompleted(false);
        if (outside) {
            setAnchorEl(null);
            if (isSelected) {
                handleMenuClick(isSelected, id);
            }
        }
        if (multiple) {
            if (
                isSelected.filter((value) => value === item?.value).length === 0
            ) {
                item?.value && setIsSelected([...isSelected, item?.value]);
            } else {
                setIsSelected(
                    isSelected.filter((value) => value !== item?.value)
                );
            }
        } else {
            if (item?.label) {
                setTimeout(() => {
                    handleMenuClick(item, id);
                }, 0);
            }
            setAnchorEl(null);
        }
    };
    const getBackgroundColor = ({ label }) => {
        switch (label) {
            case Object.keys(platforms).includes(label) && label:
                return `rgb(${platforms[label]})`;
            case 'Open':
                return 'var(--milestoneRowElColor)';

            // return ""
            case 'In Progress':
                return 'var(--progressBarColor)';
            case 'In Review':
                return 'var(--primary)';
            case 'Bug Persists':
            case 'Pending':
                return 'var(--red)';
            case 'Done':
            case 'Invoiced':
                return 'var(--green)';

            case 'High':
                return 'var(--red)';
            case 'Medium':
                return '#775CC3 ';
            case 'Low':
                return '#686868';
            case 'Active':
                return '#0098EB';
            case 'Not Started':
                return '#686868';
            case 'Completed':
                return '#02CD79';
            case 'Solved':
                return '#02CD79';
            case 'Approved':
                return '#02CD79';
            case 'Idle':
            case 'Partially Invoiced':
                return 'var(--chipYellow)';
            case 'Awarded':
                return 'var(--chipPink)';
            case 'Rejected':
                return 'var(--chipRed)';
            case 'Un-categorized':
                return 'rgb(98,93,245)';
            default:
                return 'transparent';
        }
        //     #b339ff
        // #7c39ff
        // #B6BAD5
    };

    const renderBugStatus = (status) => {
        return (
            <div
                className='d_flex alignCenter justifyContent_center'
                style={{ width: '100%', height: '100%' }}
            >
                <div
                    className='d_flex alignCenter'
                    // style={{minWidth:200}}
                >
                    {/* <div
          style={{
            margin: "0px 10px",
            fontSize: 12,
            color: "var(--newBlueLight)",
            background:"#FFF",
            height: 20,
            width: 20,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {status === "Open" && "1"}
          {status === "In Progress" && "2"}
          {status === "In Review" && "3"}
          {status === "Done" && "4"}
        </div>{" "} */}
                    <p style={{}}>
                        {' '}
                        {status === 'In Progress'
                            ? 'Work In Progress'
                            : status === 'In Review'
                            ? 'Work In Review'
                            : status}
                    </p>
                </div>
            </div>
        );
    };
    React.useEffect(() => {
        setIsSelected(activeMenuItem);
    }, [activeMenuItem]);
    return (
        <div className={`inheritParent ${className}`}>
            {actionButton ? (
                <div onClick={(e) => !disabled && handleClick(e)}>
                    {actionButton}{' '}
                </div>
            ) : (
                <LightTooltip
                    // placement="top"
                    arrow
                    title={
                        disabled
                            ? Array.isArray(activeMenuItem) &&
                              !activeMenuItem?.length
                                ? 'Platform not assigned yet!'
                                : ''
                            : ''
                    }
                >
                    <div
                        className={`inheritParent d_flex alignCenter justifyContent_center  `}
                        style={{
                            cursor: disabled ? 'default' : 'pointer',
                            position: 'relative',
                            backgroundColor: getBackgroundColor({
                                label: activeMenuItem,
                            }),
                            overflow: 'hidden',
                            ...style,
                        }}
                        onClick={(e) => !disabled && handleClick(e)}
                    >
                        {isCompleted && (
                            <div className='done-crazy-balls-status-animation' />
                        )}
                        {Array.isArray(activeMenuItem) ? (
                            !isSelected.length ? (
                                <LightTooltip
                                    title={
                                        disabled ? '' : 'Click to add platform'
                                    }
                                    arrow
                                >
                                    <div>
                                        <Icon name='platform' />
                                    </div>
                                </LightTooltip>
                            ) : (
                                isSelected.map((item, index) => (
                                    <div
                                        style={{
                                            cursor: disabled
                                                ? 'default'
                                                : 'pointer',
                                            // flex: 1,
                                            display: 'flex',
                                            alignItem: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            margin: '0 5px',
                                            // backgroundColor: getBackgroundColor({
                                            //   label: item,
                                            // }),
                                        }}
                                        key={index}
                                    >
                                        <LightTooltip title={item} arrow>
                                            <div className='d_flex alignCenter'>
                                                <Icon
                                                    className='px-051'
                                                    style={{
                                                        fill: '#FFF',
                                                        height: 16,
                                                        width: 16,
                                                    }}
                                                    name={item}
                                                />
                                                {/* {item} */}
                                            </div>
                                        </LightTooltip>
                                    </div>
                                ))
                            )
                        ) : menuName === 'bugStatus' ? (
                            renderBugStatus(activeMenuItem)
                        ) : (
                            activeMenuItem
                        )}
                    </div>
                </LightTooltip>
            )}

            <StyledMenu
                id='customized-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => handleClose(undefined, true)}
            >
                {multiple
                    ? menuItems?.map((item, i) => (
                          <StyledMenuItem
                              key={`menuItem_${i}`}
                              onClick={() => handleClose(item)}
                              style={{
                                  backgroundColor: getBackgroundColor(item),
                                  color: 'white',
                              }}
                          >
                              <Checkbox
                                  size='small'
                                  className='p-0 pr-1'
                                  checked={isSelected.includes(item?.value)}
                              />

                              <Icon
                                  //  style={{height : 15 , width : 15}}
                                  className='pr-1'
                                  name={item?.value}
                                  style={{
                                      fill: '#FFF',
                                      height: 28,
                                      width: 28,
                                  }}
                              />

                              <ListItemText primary={item.label} />
                          </StyledMenuItem>
                      ))
                    : menuItems?.map((item, i) =>
                          menuName === 'bugStatus' ? (
                              <div
                                  key={`menuItem_${i}`}
                                  onClick={() => handleClose(item)}
                                  style={{
                                      backgroundColor: getBackgroundColor(item),
                                      color: 'white',
                                      height: 35,
                                      minWidth: 170,
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontFamily: 'Lato-Regular',
                                      borderBottom:
                                          menuItems?.length - 1 === i
                                              ? ''
                                              : '1px solid gray',
                                  }}
                              >
                                  {renderBugStatus(item?.label)}
                              </div>
                          ) : (
                              <StyledMenuItem
                                  key={`menuItem_${i}`}
                                  onClick={() => handleClose(item)}
                                  style={{
                                      backgroundColor: getBackgroundColor(item),
                                      color: 'white',
                                  }}
                              >
                                  <ListItemText
                                      primary={
                                          menuName === 'bugStatus'
                                              ? renderBugStatus(item?.label)
                                              : item?.label
                                      }
                                  />
                              </StyledMenuItem>
                          )
                      )}
            </StyledMenu>
        </div>
    );
}

export default memo(CustomMenu);
