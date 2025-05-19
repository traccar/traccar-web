import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
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
import { useCatchCallback } from '../reactHelper';
import useSettingsStyles from './common/useSettingsStyles';

const SharePage = () => {
  const navigate = useNavigate();
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const { id } = useParams();

  const device = useSelector((state) => state.devices.items[id]);

  const [expiration, setExpiration] = useState(dayjs().add(1, 'week').locale('en').format('YYYY-MM-DD'));
  const [link, setLink] = useState();

  const handleShare = useCatchCallback(async () => {
    const expirationTime = dayjs(expiration).toISOString();
    const response = await fetch('/api/devices/share', {
      method: 'POST',
      body: new URLSearchParams(`deviceId=${id}&expiration=${expirationTime}`),
    });
    if (response.ok) {
      const token = await response.text();
      setLink(`${window.location.origin}?token=${token}`);
    } else {
      throw Error(await response.text());
    }
  }, [id, expiration, setLink]);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['deviceShare']}>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              value={device.name}
              label={t('sharedDevice')}
              disabled
            />
            <TextField
              label={t('userExpirationTime')}
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleShare}
            >
              {t('reportShow')}
            </Button>
            <TextField
              value={link || ''}
              onChange={(e) => setLink(e.target.value)}
              label={t('sharedLink')}
              InputProps={{
                readOnly: true,
              }}
            />
          </AccordionDetails>
        </Accordion>
        <div className={classes.buttons}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            {t('sharedCancel')}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={() => navigator.clipboard?.writeText(link)}
            disabled={!link}
          >
            {t('sharedCopy')}
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
};

export default SharePage;
