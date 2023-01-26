import CustomButton from 'components/CustomButton';
import PopoverSelect from 'pages/invoice/createInvoice/popoverSelect/PopoverSelect';
import React from 'react';
import { useState } from 'react';
import CustomPopover from './CustomPopover';
import styles from './UserProfile.module.css';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { permissionManager } from 'api/profile';
import { useSelector } from 'react-redux';
import {
    getNotSelectedPermission,
    getSelectedPermission,
    permission_data,
} from './permissionData';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const GivePermission = ({ userId, handleClose, permission }) => {
    console.log('permission', permission);

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(
        getNotSelectedPermission(permission)
    );
    const [right, setRight] = React.useState(getSelectedPermission(permission));
    const [isLoading, setIsLoading] = useState(false);

    const selectedOrg = useSelector(
        (state) => state.userReducer?.selectedOrganisation
    );
    const orgId = selectedOrg?._id;

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const onUpdatePress = async () => {
        console.log('right', JSON.stringify(right, null, 2));
        setIsLoading(true);
        const dataToSent = {
            permissions: right.map((el) => el.value),
            user: userId,
        };
        await permissionManager(dataToSent, orgId)
            .then(() => {
                handleClose();
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const customList = (items, side) => (
        <Paper sx={{ width: 300, height: 430, overflow: 'auto' }}>
            <p className={styles.heading}>
                {side === 'left' ? 'Not Permitted for' : 'Permitted for'}
            </p>
            <List dense component='div' role='list'>
                {items?.length > 0 ? (
                    items.map((value) => {
                        const labelId = value.key;

                        return (
                            <ListItem
                                key={value.id}
                                role='listitem'
                                button
                                onClick={handleToggle(value)}
                                className={styles.customerName}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={value.name}
                                />
                            </ListItem>
                        );
                    })
                ) : (
                    <p>No Permission</p>
                )}
                <ListItem />
            </List>
        </Paper>
    );
    return (
        <div>
            <Grid
                container
                spacing={2}
                justifyContent='center'
                alignItems='center'
            >
                <Grid item>{customList(left, 'left')}</Grid>
                <Grid item>
                    <Grid container direction='column' alignItems='center'>
                        <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label='move all right'
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label='move selected right'
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label='move selected left'
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant='outlined'
                            size='small'
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label='move all left'
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right, 'right')}</Grid>
            </Grid>
            <div className={styles.lowerButton}>
                <CustomButton loading={isLoading} onClick={onUpdatePress}>
                    Update
                </CustomButton>
            </div>
        </div>
    );
};

export default GivePermission;
