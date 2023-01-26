import { createTheme } from "@material-ui/core/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#f29726",
      
    },
    
    secondary: {
      main: "#625df5",
    },

    success: {
      main: "#00ff00",
    },
    grey: {
      main: "#9d9999",
    },
    common: {
      main: "#191b34",
      white: "#ffffff",
    },

    background: {
      default: "#191b34",
      secondary: "#29304c",
    },
    text: {
      primary: "#f29726",
      secondary: "#ffffff",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        
        "*::-webkit-scrollbar": {
            width: 6,
      backgroundColor: "transparent",
        },
            "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#4b4e69",
      borderRadius: 10,
    },
      },
    },
  },
  typography:{
    fontFamily : ["Lato-Regular"].join(','),
  }
});
export default theme;
