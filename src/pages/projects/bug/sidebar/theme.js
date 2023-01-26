import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  overrides: {
    // MuiButton: {
    //   contained: {
    //     "text-transform": "initial",
    //     "letter-spacing": "initial"
    //   },
    //   outlined: {
    //     "text-transform": "initial",
    //     "border-color": "#a3a3a3",
    //     "letter-spacing": "initial"
    //   },
    //   outlinedPrimary: {
    //     "border-color": "#067A82"
    //   },
    //   text: {
    //     "text-transform": "initial",
    //     "letter-spacing": "initial"
    //   }
    // },
    MuiTimelineItem: {
      missingOppositeContent: {
        "&:before": {
          display: "none"
        }
      }
    }
  },
  props: {
    // MuiButton: {
    //   disableElevation: true,
    //   size: "large"
    // },
    // MuiButtonBase: {
    //   disableRipple: true
    // },
    // MuiTimelineDot: {
    //   color: "primary"
    // }
  },
  palette: {
    // primary: {
    //   main: "#067A82"
    // },
    // secondary: {
    //   main: "#525252"
    // }
  },
//   typography: {
//     allVariants: {
//       color: "#444;"
//     },
//     h6: {
//       fontFamily: DisplayFont,
//       fontWeight: 700,
//       fontSize: "16px"
//     },
//     body1: {
//       fontWeight: "initial"
//     }
//   }
});

export default theme;
