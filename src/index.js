import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "App";
import { Provider } from "react-redux";
import store from "redux/store";
import theme from "theme/MuiTheme";
import { ThemeProvider } from "@material-ui/core/styles";
import ErrorBoundary from "components/ErrorBoundary";
import { GlobalCss } from "theme/GlobalCss";
import { Scrollbars } from "react-custom-scrollbars";
import ColoredScrollbars from "ColoredScrollbar";
import SimpleReactLightbox from "simple-react-lightbox";
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {/* <ErrorBoundary> */}
      <GlobalCss />
      {/* <ColoredScrollbars
        style={{
          width: "100vw",
          height: "100vh",
          fontFamily: "Lato-Regular",
        }}
        universal
        autoHide
      > */}
      <SimpleReactLightbox>
        <App />
      </SimpleReactLightbox>
      {/* </ColoredScrollbars> */}
      {/* </ErrorBoundary> */}
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
