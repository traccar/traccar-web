import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  TextField,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import { useCatch } from '../reactHelper';
import { useAttributePreference } from '../common/util/preferences';
import { distanceFromMeters, distanceToMeters, distanceUnitString } from '../common/util/converter';
import useSettingsStyles from './common/useSettingsStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';

const AccumulatorsPage = () => {
  const navigate = useNavigate();
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const distanceUnit = useAttributePreference('distanceUnit');

  const { deviceId } = useParams();
  const position = useSelector((state) => state.session.positions[deviceId]);

  const [item, setItem] = useState();

  useEffect(() => {
    if (position && !item) {
      setItem({
        deviceId: parseInt(deviceId, 10),
        hours: (position.attributes.hours || 0) / 3_600_000,
        totalDistance: distanceFromMeters(position.attributes.totalDistance || 0, distanceUnit),
      });
    }
  }, [deviceId, position, item, distanceUnit]);

  const handleSave = useCatch(async () => {
    const updateItem = {
      ...item,
      hours: item.hours * 3_600_000,
      totalDistance: distanceToMeters(item.totalDistance, distanceUnit),
    };
    await fetchOrThrow(`/api/devices/${deviceId}/accumulators`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateItem),
    });
    navigate(-1);
  });

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['sharedDeviceAccumulators']}>
      {item && (
        <Container maxWidth="xs" className={classes.container}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                type="number"
                value={item.hours}
                onChange={(event) => setItem({ ...item, hours: Number(event.target.value) })}
                label={t('positionHours')}
              />
              <TextField
                type="number"
                value={item.totalDistance}
                onChange={(event) =>
                  setItem({ ...item, totalDistance: Number(event.target.value) })
                }
                label={`${t('deviceTotalDistance')} (${distanceUnitString(distanceUnit, t)})`}
              />
            </AccordionDetails>
          </Accordion>
          <div className={classes.buttons}>
            <Button type="button" color="primary" variant="outlined" onClick={() => navigate(-1)}>
              {t('sharedCancel')}
            </Button>
            <Button type="button" color="primary" variant="contained" onClick={handleSave}>
              {t('sharedSave')}
            </Button>
          </div>
        </Container>
      )}
    </PageLayout>
  );
};

export default AccumulatorsPage;
