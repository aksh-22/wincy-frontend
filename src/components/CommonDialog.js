import React, { memo } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
const useStyles = makeStyles((theme, props) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        display: 'flex',
    },
    closeButton: {
        // position: "absolute",
        // right: theme.spacing(0),
        // top: theme.spacing(0),
        color: 'var(--defaultWhite)',
        padding: 0,
    },
    paper: {
        background: theme.palette.background.default,
        color: 'var(--defaultWhite)',
        width: (props) => props.width,
        minHeight: (props) => props.height,
        maxHeight: (props) => props?.maxHeight,
        minWidth: (props) => props.minWidth,
        maxWidth: (props) => props.maxWidth,
        // padding: '20px 10px',
    },
}));

const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    const classes = useStyles();
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography
                variant='h5'
                className='headerFont'
                style={{
                    flex: 1,
                }}
            >
                {children}
            </Typography>
            {onClose ? (
                <IconButton
                    aria-label='close'
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon style={{ fontSize: 22 }} />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const CommonDialog = ({
    actionComponent,
    modalTitle = '',
    content,
    width,
    height,
    minWidth,
    dialogContentClass,
    shouldOpen,
    OtherClose,
    hideCloseIcon,
    maxWidth,
    size,
    maxHeight,
    actionComponentButton,
    className,
}) => {
    const props = {
        width: width,
        height: height,
        minWidth: minWidth,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
    };
    const classes = useStyles(props);
    const [open, setOpen] = React.useState(shouldOpen ?? false);
    const handleClickOpen = () => {
        setOpen(true);
        // console.log("in handleClickOpen");
    };
    const handleClose = () => {
        setOpen(false);
        // console.log("in handleClose");
    };

    // useEffect(() => {
    //   setOpen(false);
    // }, []);
    useEffect(() => {
        // console.log("shouldOpen:", shouldOpen);
        if (!shouldOpen) {
            handleClose();
        }
    }, [shouldOpen]);

    return (
        <>
            {actionComponent &&
                React.cloneElement(actionComponent, {
                    onClick: handleClickOpen,
                    // handleClose: handleClose,
                })}

            {actionComponentButton && (
                <div onClick={handleClickOpen}>{actionComponentButton}</div>
            )}
            <Dialog
                disableEnforceFocus
                classes={{ paper: classes.paper }}
                // onClose={OtherClose ?? handleClose}
                aria-labelledby='customized-dialog-title'
                // open={shouldOpen ? shouldOpen : open}
                open={open}
                className={`boxShadow ${className}`}
                PaperProps={{ className: 'boxShadow' }}
                maxWidth={size}
                disableRestoreFocus={true}
            >
                <DialogTitle
                    id='customized-dialog-title'
                    onClose={
                        hideCloseIcon ? undefined : OtherClose ?? handleClose
                    }
                    style={{
                        padding: '8px 16px',
                        boxShadow: 'none',
                        borderBottom: '1px solid var(--divider)',
                        fontSize: 30,
                    }}
                >
                    {modalTitle}
                </DialogTitle>
                <DialogContent dividers className={dialogContentClass}>
                    {content &&
                        React.cloneElement(content, {
                            handleClose: handleClose,
                        })}
                </DialogContent>
            </Dialog>
        </>
    );
};
export default memo(CommonDialog);
