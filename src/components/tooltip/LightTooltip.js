import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#FFF",
    color: "#000",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    zIndex: 9999999999999999999999999,
    fontFamily: "Raleway-Regular",
    minHeight: 30,
    minWidth: 30,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexWrap: "wrap",
    // overflow:"hidden"
  },
  arrow: {
    "&::before": {
      backgroundColor: theme.palette.common.white,
      border: `2px solid ${theme.palette.common.white}`,
      zIndex: 9999999999999999999999999,
    },
  },
  popper: {
    zIndex: 9999999999999999999999999,
  },
}))(Tooltip);
