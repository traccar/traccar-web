import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Tooltip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useDeviceReadonly, useRestriction } from '../common/util/permissions';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  // Groups takes its natural width; Add device takes the rest and never wraps
  secondary: {
    flex: '0 0 auto',
    paddingInline: theme.spacing(2.5),
  },
  primary: {
    flex: 1,
    minWidth: 0,
    whiteSpace: 'nowrap',
  },
}));

// Fleet actions under the device list: manage groups and add a device
const DeviceListFooter = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const readonly = useRestriction('readonly');
  const deviceReadonly = useDeviceReadonly();
  const devices = useSelector((state) => state.devices.items);
  const devicesLoaded = useSelector((state) => state.devices.loaded);

  if (readonly && deviceReadonly) {
    return null;
  }

  return (
    <Paper square elevation={0} className={classes.root}>
      {!readonly && (
        <Button
          variant="outlined"
          color="inherit"
          className={classes.secondary}
          onClick={() => navigate('/settings/groups')}
        >
          {t('settingsGroups')}
        </Button>
      )}
      {!deviceReadonly && (
        <Tooltip
          open={devicesLoaded && Object.keys(devices).length === 0}
          title={t('deviceRegisterFirst')}
          arrow
        >
          <Button
            variant="contained"
            color="secondary"
            className={classes.primary}
            startIcon={<AddIcon />}
            onClick={() => navigate('/settings/device')}
          >
            {t('deviceAdd')}
          </Button>
        </Tooltip>
      )}
    </Paper>
  );
};

export default DeviceListFooter;
