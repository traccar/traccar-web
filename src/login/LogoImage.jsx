import { useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import Logo from "../resources/images/TfnikanSolid.svg?react";

const useStyles = makeStyles()((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '400px',
    maxHeight: '200px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
  },
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const { classes } = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down("lg"));

  const logo = useSelector((state) => state.session.server.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  if (logo) {
    if (expanded && logoInverted) {
      return <img className={classes.image} src={logoInverted} alt="" />;
    }
    return <img className={classes.image} src={logo} alt="" />;
  }
  return <Logo className={classes.image} style={{ color }} />;
};

export default LogoImage;
