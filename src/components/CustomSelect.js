import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  useTheme,
} from "@material-ui/core";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import CustomAvatarGroup from "./CustomAvatarGroup/CustomAvatarGroup";
import CustomChip from "./CustomChip";

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
    flexDirection: "column",
    // marginBottom: 10,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  selectMenu: {
    padding: 100,
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      padding: 0,
      // marginTop: 50,
      // background: "var(--newBlueLight)",
      background: "#2F3453",
      // maxHeight: 180,
      maxHeight: "calc(20%)",
      overflowY: "auto",
      // top:"-10%"
    },
  },
  variant: "menu",
  disablePortal: true,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: theme.typography.fontWeightMedium,
    // personName.indexOf(name) === -1
    //   ? theme.typography.fontWeightRegular
    //   : theme.typography.fontWeightMedium,
  };
}

function CustomSelect({
  errorText,
  inputLabel,
  multiple,
  handleChange,
  value,
  menuItems,
  menuRenderComponent,
  selectRenderComponent,
  name,
  selectRowClassName,
  labelClassName,
  containerClassName,
  placeholder,
  variant,
  className,
  style,
  helperText,
  max,
  onClose,
  containerStyle,
  errorStyle,
  isLoading,
  disabled,
}) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <FormControl
        className={`${classes.formControl} ${containerClassName}`}
        variant={variant}
        style={containerStyle}
        disabled={disabled}
      >
        {inputLabel && (
          <InputLabel
            id="demo-multiple-chip-label"
            className={labelClassName}
            error={errorText ? true : false}
            style={{
              position : variant !== "outlined" && "relative"
            }}
          >
            {inputLabel}
          </InputLabel>
        )}

        <div className="alignCenter">
          <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            className={className}
            style={style}
            variant={variant}
            // className="pt-1"
            multiple={multiple ?? false}
            value={value}
            name={name}
            onChange={handleChange}
            onClose={onClose}
            input={
              <Input
                error={errorText ? true : false}
                id="select-multiple-chip"
              />
            }
            renderValue={(selected) =>
              multiple ? (
                <div className={`${classes.chips}`}>
                  {selectRenderComponent ? (
                    React.cloneElement(selectRenderComponent, {
                      item: selected,
                      selected: true,
                      placeholder: placeholder,
                    })
                  ) : (
                    <CustomAvatarGroup
                      max={max ?? 5}
                      extraavatarstooltiptitle={selected?.map(
                        (value, index) =>
                          index > (max ?? 5) - (2 ?? 3) && (
                            <CustomChip
                              key={index}
                              label={value}
                              bgColor={menuItems[value]}
                              className="mr-1 mb-1"
                            />
                          )
                      )}
                    >
                      {selected.map((value, index) =>
                        value === placeholder ? (
                          <p key={index}>{value}</p>
                        ) : (
                          <CustomChip
                            key={index}
                            label={value}
                            bgColor={menuItems[value]}
                            className="mr-1 "
                          />
                        )
                      )}
                    </CustomAvatarGroup>
                  )}
                </div>
              ) : typeof selected === "object" ? (
                React.cloneElement(selectRenderComponent, {
                  item: selected,
                  selected: true,
                  placeholder: placeholder,
                })
              ) : (
                <p
                  className="smallFont"
                  style={{ color: selected === placeholder && "#757575" }}
                >
                  {selected}
                </p>
              )
            }
            MenuProps={MenuProps}
          >
            {placeholder && (
              <MenuItem disabled value="" style={{ paddingLeft: 16 }}>
                <p style={{ color: "red !important" }}>{placeholder}</p>
              </MenuItem>
            )}
            {menuItems?.length === 0 && (
              <MenuItem
                className="d_flex alignCenter justifyContent_center normalFont"
                disabled
              >
                No Option Available
              </MenuItem>
            )}
            {!Array.isArray(menuItems)
              ? Object.entries(menuItems).map(([key]) => (
                  <MenuItem
                    className="normalFont"
                    key={key}
                    value={key}
                    style={getStyles(key, value, theme)}
                  >
                    {key}
                  </MenuItem>
                ))
              : menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item}
                    style={getStyles(item, value, theme)}
                    className={`${selectRowClassName} normalFont`}
                  >
                    {menuRenderComponent
                      ? React.cloneElement(menuRenderComponent, {
                          item: item,
                        })
                      : item}
                    {/* <ListItemIcon>
                <img src = {item.image} />
              </ListItemIcon>
                  <span>{item.name}</span> */}
                  </MenuItem>
                ))}
          </Select>
          {isLoading && (
            <div className="ml-1">
              <ClipLoader loading={isLoading} color="#FFF" size={16} />
            </div>
          )}
        </div>
        {(helperText || errorText) && (
          <FormHelperText error={errorText ? true : false} style={errorStyle}>
            {errorText}
          </FormHelperText>
        )}
      </FormControl>
      {/* {errorText && <ErrorMessage children={errorText} />} */}
    </>
  );
}

export default CustomSelect;
