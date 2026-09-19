import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import amsonLogo from '../resources/images/amson-logo.png';

const useStyles = makeStyles()(() => ({
  image: {
    alignSelf: 'center',
    maxWidth: '100px',
    maxHeight: '100px',
    width: 'auto',
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
    borderRadius: '12px',
  },
}));

const LogoImage = ({ className, style }) => {
  const theme = useTheme();
  const { classes } = useStyles();

  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  const logo = useSelector((state) => state.session.server.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  const finalClass = className || classes.image;

  if (logo) {
    if (expanded && logoInverted) {
      return <img className={finalClass} src={logoInverted} alt="AmsonSoft" style={style} />;
    }
    return <img className={finalClass} src={logo} alt="AmsonSoft" style={style} />;
  }
  return <img className={finalClass} src={amsonLogo} alt="AmsonSoft" style={style} />;
};

export default LogoImage;
