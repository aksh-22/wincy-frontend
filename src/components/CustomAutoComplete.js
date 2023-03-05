import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import CustomAvatar from './CustomAvatar';
import CustomChip from './CustomChip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
const CustomAutoComplete = ({
    options,
    multiple,
    value,
    onChange,
    isLoading,
    handleRemove,
    label,
    width,
    disableClearable,
    name,
    labelKey = 'name',
}) => {
    const useStyles = makeStyles({
        paper: {
            backgroundColor: 'var(--milestoneRowColor)',
        },
        '@global': {
            '.MuiAutocomplete-option[data-focus="true"]': {
                background: 'var(--lightBlue)',
            },
        },
    });
    const classes = useStyles();
    console.log('option', options);
    return (
        <Autocomplete
            classes={{ paper: classes.paper }}
            disabled={isLoading}
            id='assignTeam'
            style={{ width: width ?? 350, zIndex: 1 }}
            options={options ?? []}
            multiple={multiple ?? false}
            disableCloseOnSelect
            // limitTags={2}
            disableClearable={disableClearable ?? true}
            value={value}
            onChange={(e, value, reason) => {
                if (reason !== 'remove-option') onChange(value);
            }}
            renderTags={(tags) => {
                isLoading && <div>Loading...</div>;
                return tags?.map((tag) => (
                    <CustomChip
                        label={tag.name}
                        id={tag._id}
                        avatar={
                            <CustomAvatar
                                small
                                src={tag.profilePicture ?? null}
                            />
                        }
                        handleClose={(label) => handleRemove(label)}
                        style={{ margin: 5 }}
                        key={tag.name}
                    />
                ));
            }}
            loading={isLoading}
            autoHighlight
            getOptionLabel={(option) => option?.[labelKey]}
            renderOption={(option) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 30,
                        // margin: 10,
                    }}
                >
                    {
                        <CustomAvatar
                            variant='circle'
                            src={option?.profilePicture ?? null}
                            small
                        />
                    }
                    <p
                        style={{
                            fontSize: 14,
                            marginLeft: 5,
                            color: 'var(--defaultWhite)',
                        }}
                    >
                        {option?.name}
                    </p>
                </div>
            )}
            renderInput={(params) => (
                <TextField
                    autoFocus
                    placeholder={label}
                    // variant="outlined"
                    {...params}
                    name={name}
                    size='medium'
                    style={{
                        fontSize: 10,
                        backgroundColor: 'var(--lightGray)',
                        padding: 5,
                    }}
                    inputProps={{
                        ...params.inputProps,
                        endAdornment: (
                            <>
                                {isLoading && (
                                    <CircularProgress
                                        color='primary'
                                        size={20}
                                    />
                                )}
                                {params.inputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default CustomAutoComplete;
