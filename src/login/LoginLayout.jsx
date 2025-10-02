import { useMediaQuery, Paper } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import LogoImage from "./LogoImage";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    height: "100%",
    background: theme.palette.background.paper,
  },
  loginHead: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: theme.spacing(5),
    paddingRight: theme.spacing(20),
    width: "60%",

    [theme.breakpoints.down("lg")]: {
      width: theme.dimensions.sidebarWidthTablet,
    },

    [theme.breakpoints.down("sm")]: {
      width: "0px",
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    background: "none !important",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    boxShadow: "none !important",
    [theme.breakpoints.up("lg")]: {
      flexDirection: "row",

      padding: theme.spacing(0, 0, 0, 0),
    },
  },
  form: {
    maxWidth: theme.spacing(52),
    padding: theme.spacing(5),
    width: "100%",
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        {!useMediaQuery(theme.breakpoints.down("lg")) && (
          <LogoImage color={theme.palette.secondary.contrastText} />
        )}
      </div>
      <Paper className={classes.paper}>
        <form className={classes.form}>{children}</form>
      </Paper>
      {!useMediaQuery(theme.breakpoints.down("lg")) && (
        <div className={classes.loginHead}>
          <LogoImage color={theme.palette.secondary.contrastText} />
        </div>
      )}
    </main>
  );
};

export default LoginLayout;
