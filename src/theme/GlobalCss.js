import { withStyles } from "@material-ui/core";

export const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  "@global": {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    ".MuiCheckbox-root": {
      color: "white",
    },
    ".Mui-checked PrivateSwitchBase-checked": {
      color: "red",
    },
    ".MuiCheckbox-colorPrimary": {
      color: "white",
    },
    ".MuiCheckbox-colorSecondary": {
      color: "white",
    },
    "PrivateSwitchBase-checked": {
      color: "white",
    },
    ".MuiCheckbox-colorSecondary.Mui-checked": {
      color: "white",
    },
  },
})(() => null);
