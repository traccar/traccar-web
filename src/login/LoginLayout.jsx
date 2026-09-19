import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoImage from './LogoImage';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '45%',
    maxWidth: '640px',
    minWidth: '420px',
    padding: theme.spacing(6, 6, 5),
    background: 'linear-gradient(160deg, #ffffff 0%, #fbfcfd 50%, #fff1f2 100%)',
    position: 'relative',
    overflow: 'hidden',
    borderRight: '1px solid #f1f5f9',
    boxShadow: '4px 0 24px rgba(15, 23, 42, 0.02)',
    animation: 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  ambientGlow1: {
    position: 'absolute',
    top: '-15%',
    left: '-10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'breatheGlow 9s ease-in-out infinite alternate',
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(244, 63, 94, 0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'breatheGlow 11s ease-in-out infinite alternate-reverse',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2.25),
    animation: 'fadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(225, 29, 72, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
    transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms ease',
    '&:hover': {
      transform: 'scale(1.05) rotate(-1deg)',
      boxShadow: '0 8px 24px rgba(225, 29, 72, 0.14)',
    },
  },
  logoImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    objectFit: 'contain',
    display: 'block',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 10px',
    borderRadius: 20,
    backgroundColor: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#e11d48',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    width: 'fit-content',
    transition: 'transform 200ms ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  brandTitle: {
    color: '#0f172a',
    fontWeight: 800,
    fontSize: '1.35rem',
    letterSpacing: '-0.02em',
    marginTop: 4,
    lineHeight: 1.2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#e11d48',
    animation: 'pulseDot 2s cubic-bezier(0.45, 0, 0.55, 1) infinite',
  },
  heroTextSection: {
    margin: theme.spacing(4, 0),
    animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both',
  },
  heroTitle: {
    fontWeight: 800,
    fontSize: '2.1rem',
    color: '#0f172a',
    letterSpacing: '-0.03em',
    lineHeight: 1.22,
    marginBottom: theme.spacing(1.5),
  },
  heroSubtitle: {
    color: '#475569',
    fontSize: '0.92rem',
    lineHeight: 1.6,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.75),
  },
  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1.75, 2),
    borderRadius: 16,
    backgroundColor: '#ffffff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03), 0 1px 3px rgba(15, 23, 42, 0.02)',
    transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 28px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)',
      borderColor: '#fecdd3',
      '& .feature-icon': {
        transform: 'scale(1.1) rotate(2deg)',
      },
    },
  },
  featureCard1: {
    animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.34s both',
  },
  featureCard2: {
    animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.46s both',
  },
  featureCard3: {
    animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.58s both',
  },
  featureIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  featureTitle: {
    color: '#0f172a',
    fontSize: '0.88rem',
    fontWeight: 600,
    lineHeight: 1.25,
  },
  featureDesc: {
    color: '#64748b',
    fontSize: '0.78rem',
    lineHeight: 1.45,
    marginTop: 3,
  },
  trustFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#64748b',
    fontSize: '0.74rem',
    fontWeight: 500,
    marginTop: theme.spacing(3),
    animation: 'fadeIn 1s ease 0.7s both',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4, 2),
    position: 'relative',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    animation: 'fadeIn 0.9s ease both',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: '440px',
    margin: 'auto',
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.03)',
    padding: theme.spacing(4.5, 4),
    animation: 'cardScaleUp 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both',
    transition: 'transform 300ms ease, box-shadow 300ms ease',
    '&:hover': {
      boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.11), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3.5, 2.5),
      borderRadius: 20,
    },
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();

  return (
    <main className={classes.root}>
      <div className={classes.hero}>
        <div className={classes.ambientGlow1} />
        <div className={classes.ambientGlow2} />
        <div className={classes.heroContent}>
          <div className={classes.brandRow}>
            <div className={classes.logoBadge}>
              <LogoImage className={classes.logoImg} />
            </div>
            <div className={classes.brandText}>
              <div className={classes.brandPill}>
                <span className={classes.pulseDot} />
                <span>AmsonSoft Telematics</span>
              </div>
              <Typography className={classes.brandTitle}>
                AmsonTracker
              </Typography>
            </div>
          </div>

          <div className={classes.heroTextSection}>
            <Typography variant="h3" className={classes.heroTitle}>
              Precision Fleet Intelligence & Telematics
            </Typography>
            <Typography variant="body1" className={classes.heroSubtitle}>
              Engineered by AmsonSoft for real-time asset visibility, sub-second GPS telemetry, predictive analytics, and automated safety perimeters.
            </Typography>
          </div>

          <div className={classes.features}>
            <div className={`${classes.featureCard} ${classes.featureCard1}`}>
              <div className={`${classes.featureIconBox} feature-icon`}>
                <GpsFixedIcon fontSize="small" />
              </div>
              <div>
                <Typography className={classes.featureTitle}>Sub-Second Live Tracking</Typography>
                <Typography className={classes.featureDesc}>
                  Instant location coordinates, velocity, ignition status, and live battery telemetry.
                </Typography>
              </div>
            </div>

            <div className={`${classes.featureCard} ${classes.featureCard2}`}>
              <div className={`${classes.featureIconBox} feature-icon`}>
                <ShieldOutlinedIcon fontSize="small" />
              </div>
              <div>
                <Typography className={classes.featureTitle}>Automated Geofencing</Typography>
                <Typography className={classes.featureDesc}>
                  Instant perimeter security alerts and multi-zone entry/exit activity logging.
                </Typography>
              </div>
            </div>

            <div className={`${classes.featureCard} ${classes.featureCard3}`}>
              <div className={`${classes.featureIconBox} feature-icon`}>
                <TimelineOutlinedIcon fontSize="small" />
              </div>
              <div>
                <Typography className={classes.featureTitle}>Trip History & Replay</Typography>
                <Typography className={classes.featureDesc}>
                  High-definition historical route playback with complete speed and stop metrics.
                </Typography>
              </div>
            </div>
          </div>

          <div className={classes.trustFooter}>
            <LockOutlinedIcon sx={{ fontSize: 16, color: '#e11d48' }} />
            <span>Powered by AmsonSoft • 256-Bit SSL Telematics • 99.9% Uptime</span>
          </div>
        </div>
      </div>

      <div className={classes.rightSection}>
        <div className={classes.cardWrapper}>
          <div className={classes.card}>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginLayout;
