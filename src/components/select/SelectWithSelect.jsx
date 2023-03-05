import { FormHelperText } from '@material-ui/core';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import classes from './select.module.css';

const SelectWithSelect = ({
    options,
    labelKey = 'title',
    loading,
    className,
    variant,
    placeholder,
    paperClassName,
    labelClassName,
    onChange,
    name,
    value,
    errorText,
}) => {
    return (
        <div>
            <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={options}
                getOptionLabel={(option) => option[labelKey]}
                sx={{ paddingRight: 0, padding: 0 }}
                renderInput={(params) =>
                    value ? (
                        <TextField {...params} variant='standard' />
                    ) : (
                        <TextField
                            {...params}
                            placeholder={placeholder}
                            variant='standard'
                        />
                    )
                }
                loading={loading}
                className={className}
                placeholder={placeholder}
                classes={{
                    paper: `${classes.paperClassName} ${paperClassName}`,
                    option: `${classes.tag} ${labelClassName}`,
                    loading: classes.loading,
                    clearIndicator: classes.loading,
                    popupIndicator: classes.loading,
                    input: classes.input,
                    root: classes.root,
                }}
                onChange={onChange}
                value={value}
            />
            {errorText && (
                <FormHelperText
                    error={errorText ? true : false}
                    // style={errorStyle}
                >
                    {errorText}
                </FormHelperText>
            )}
        </div>
    );
};

export default SelectWithSelect;
