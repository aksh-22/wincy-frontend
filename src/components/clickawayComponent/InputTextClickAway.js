import { ClickAwayListener } from '@material-ui/core';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import React, { memo } from 'react';
import { useState, useEffect, useCallback } from 'react';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

function InputTextClickAway({
    type,
    value,
    onChange,
    disabled,
    extraData,
    height,
    style,
    objectKey,
    className,
    containerStyle,
    textStyle,
    textClassName,
    placeholder,
    inputClassName,
    textArea,
    rows,
    cols,
    flexDisable,
    checkEmailError,
    placeholderText,
    paddingLeftNone,
    ...otherProps
}) {
    const [tempValue, setTempValue] = useState(value);
    const [isEdit, setIsEdit] = useState(false);
    const isEditToggle = () => {
        setIsEdit(!isEdit);
    };
    const [error, setError] = useState(null);

    const clickAwayCall = () => {
        if (!tempValue?.trim()?.length || value === tempValue) {
            // setTempValue(value);
            setIsEdit(false);
            return null;
        }

        if (checkEmailError) {
            const emailRegex =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (emailRegex.test(tempValue)) {
            } else {
                return setError('Please enter a proper email');
            }
        }
        if (extraData) {
            let tempObj = { ...extraData };
            tempObj.data[objectKey] = tempValue;
            onChange && onChange(tempObj);
        } else {
            onChange && onChange(tempValue);
        }
        setIsEdit(false);
    };

    //   Esc key detect
    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            setIsEdit(false);
            setTempValue(value);
        }
    }, []);
    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);
        return () => {
            document.removeEventListener('keydown', escFunction, false);
        };
    }, []);

    const onClickAway = useCallback(() => {
        if (String(value)?.trim() !== tempValue?.trim() && !disabled) {
            clickAwayCall();
        }
        setIsEdit(false);
    }, [value, tempValue, disabled]);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <div
                {...otherProps}
                className={`d_flex ${flexDisable ?? 'flex'} ${className}`}
                style={{
                    position: 'relative',
                    ...containerStyle,
                }}
            >
                {!isEdit ? (
                    <LightTooltip title={value > 60 ? value : ''} arrow>
                        <p
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                disabled || isEditToggle();
                            }}
                            style={{
                                paddingLeft: paddingLeftNone ?? 10,
                                cursor: disabled ? 'default' : 'auto',
                                ...textStyle,
                            }}
                            className={textClassName}
                        >
                            {value ?? placeholderText ?? 'N/A'}
                        </p>
                    </LightTooltip>
                ) : textArea ? (
                    <textarea
                        value={tempValue}
                        rows={rows}
                        cols={cols}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.shiftKey) {
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                clickAwayCall();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            height: height ?? 40,
                            flex: 1,
                            padding: 5,
                            backgroundColor: '#2F3453',
                            color: '#fff',
                            border: 'none',
                            outline: 0,
                            ...style,
                        }}
                        className={` ${inputClassName}`}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type={type ?? 'text'}
                        value={tempValue}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={(e) => {
                            setTempValue(e.target.value);
                            error !== '' && setError(null);
                        }}
                        autoFocus
                        spellCheck={true}
                        style={{
                            height: height ?? 40,
                            flex: 1,
                            paddingLeft: 10,
                            ...style,
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.shiftKey) {
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                clickAwayCall();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`inputTextClickAway ${inputClassName}`}
                    />
                )}
                {error && isEdit && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: 'translate(0px, -50%)',
                            top: '50%',
                            right: 0,
                        }}
                    >
                        <LightTooltip title={error} arrow>
                            <ErrorRoundedIcon style={{ color: 'var(--red)' }} />
                        </LightTooltip>
                    </div>
                )}
            </div>
        </ClickAwayListener>
    );
}

export default memo(InputTextClickAway);
