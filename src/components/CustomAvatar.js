import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
const useStyles = makeStyles((theme, props) => ({
  // root: {
  //   colorDefault: 'red',
  // },
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    fontWeight: "800",
  },
  initial: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  image: {
    backgroundColor: theme.palette.background.default,
    objectFit: "contain",
    zIndex: (props) => props.zIndex ?? 1,
    margin: 0,
  },
  imageLarge: {
    width: 44,
    height: 44,
    margin: 0,

  },
  imageSmall: {
    width: 26,
    height: 26,
    fontSize: 12,
    margin: 0,
  },
  imageMedium: {
    width: 32,
    height: 32,
    fontSize: 12,
    margin: 0,
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  arrow: {
    color: theme.palette.common.white,
  },
}))(Tooltip);

export default function CustomAvatar({
  src,
  title = "",
  initials = "",
  variant = "circle",
  withBorder,
  large,
  small,
  medium,
  zIndex,
  className,
  borderColor,
  borderThickness,
  style
}) {
  const props = { zIndex, src };
  const classes = useStyles(props);
  return initials ? (
    <LightTooltip arrow title={title}>
      <Avatar
        variant={variant}
        alt=""
        className={`${
          large
            ? `${classes.imageLarge} ${classes.initial}  ${className}`
            : medium
            ? `${classes.imageMedium} ${classes.initial} ${className}`
            : small
            ? `${classes.imageSmall} ${classes.initial} ${className}`
            : classes.initial
        } ${className}`}
      >
        {initials?.toUpperCase()}
      </Avatar>
    </LightTooltip>
  ) : src ? (
    <LightTooltip arrow title={title}>
      <Avatar
        sizes=""
        variant={variant}
        alt=""
        src={src}
        // classes={(classes.image, large && classes.imageLarge)}
        className={
          large
            ? `${classes.imageLarge} ${classes.image} ${className}`
            : medium
            ? `${classes.imageMedium} ${classes.image} ${className}`
            : small
            ? `${classes.imageSmall} ${classes.image} ${className}`
            : classes.image
        }
        style={
          withBorder && {
            border: withBorder
              ? `${borderThickness ?? 2}px solid ${borderColor ?? "#ee7700"}`
              : "none",
          }
        }
        onError={(e) => {
          e.target.onerror = null;

          e.target.src = "avatar.png";
        }}
      />
    </LightTooltip>
  ) : (
    <LightTooltip arrow title={title}>
      <AccountCircleRoundedIcon
        className={className}
        style={{
          fontSize: large ? 40 : medium ? 30 : 26, color:"var(--defaultWhite)" , ...style
        }}
      />
    </LightTooltip>
  );
}
