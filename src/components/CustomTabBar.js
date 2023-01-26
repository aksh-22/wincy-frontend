import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import ColoredScrollbars from "ColoredScrollbar";

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    // fontFamily: [
    //   "-apple-system",
    //   "BlinkMacSystemFont",
    //   '"Segoe UI"',
    //   // "Roboto",
    //   '"Helvetica Neue"',
    //   "Arial",
    //   "sans-serif",
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(","),
    "&:hover": {
      color: "var(--lightBlue)",
      opacity: 1,
    },
    "&$selected": {
      color: "var(--lightBlue)",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "var(--lightBlue)",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))(({ value, index, children }) => (
  <TabPanel value={value} index={index}>
    {children}
  </TabPanel>
));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingRight:"inherit"
  },
  padding: {
    // padding: theme.spacing(3),
  },
  demo1: {
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: "var(--newBlueLight)",
  },
  demo2: {
    // backgroundColor: '#2e1534',
  },
}));

export default function CustomizedTabs({
  tabBarData,
  indicatorColor,
  indicatorStyle,
}) {
  const AntTabs = withStyles({
    root: {
      // borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: indicatorColor ?? "var(--lightBlue)",
      ...indicatorStyle,
    },
  })(Tabs);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div
        className={classes.demo1}
        style={{ backgroundColor: "var(--milestoneRowElColor)" }}
      >
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          {tabBarData?.map((item, index) => (
            <AntTab
              key={index}
              // label={item.title}
              icon={
                <div className="d_flex alignCenter">
                  {item.icon}
                  <span className={`${item.icon ? "ml-1" : ""}`}>
                    {item.title}
                  </span>
                </div>
              }
            />
          ))}
        </AntTabs>
      </div>

      <div className={classes.demo2}>
        <SwipeableViews
          axis={"x"}
          index={value}
          // onChangeIndex={handleChangeIndex}
        >
          {tabBarData?.map((item, index) => (
            <StyledTab value={value} index={index} key={index}>
              {item.component}
            </StyledTab>
          ))}
        </SwipeableViews>
      </div>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (

    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >   
     {/* <ColoredScrollbars
         style={{
          // width: "100vw",
          height: "100vh",
        }}
    > */}
      {value === index && <Box >{children}</Box>}
      {/* </ColoredScrollbars> */}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
