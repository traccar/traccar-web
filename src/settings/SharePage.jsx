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
import { useAsyncTask, useCatchCallback } from '../reactHelper';
import useSettingsStyles from './common/useSettingsStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';

const SharePage = () => {
  const navigate = useNavigate();
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const { type, id } = useParams();

  const item = useSelector((state) =>
    type === 'group' ? state.groups.items[id] : state.devices.items[id],
  );

  const [expiration, setExpiration] = useState(() =>
    dayjs().add(1, 'week').locale('en').format('YYYY-MM-DDTHH:mm'),
  );
  const [share, setShare] = useState();
  const [loading, setLoading] = useState(true);
  const link = share ? `${document.baseURI}?token=${share.token}` : '';

  useAsyncTask(
    async ({ signal }) => {
      const response = await fetch(`api/share/${type}?${type}Id=${id}`, { signal });
      if (response.ok) {
        setShare(await response.json());
      } else if (response.status !== 404) {
        throw new Error(await response.text());
      }
      setLoading(false);
    },
    [id, type],
  );

  const handleShare = useCatchCallback(async () => {
    const expirationTime = dayjs(expiration).toISOString();
    const response = await fetchOrThrow(`api/share/${type}`, {
      method: 'POST',
      body: new URLSearchParams(`${type}Id=${id}&expiration=${expirationTime}`),
    });
    setShare(await response.json());
  }, [id, expiration, type]);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['sharedShare']}>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              value={item?.name || ''}
              label={t(type === 'group' ? 'groupDialog' : 'sharedDevice')}
              disabled
            />
            <TextField
              label={t('userExpirationTime')}
              type="datetime-local"
              value={
                share ? dayjs(share.expiration).locale('en').format('YYYY-MM-DDTHH:mm') : expiration
              }
              onChange={(e) => setExpiration(e.target.value)}
              disabled={loading || !!share}
            />
            {!share && (
              <Button variant="outlined" color="primary" onClick={handleShare} disabled={loading}>
                {t('reportShow')}
              </Button>
            )}
            <TextField
              value={link}
              label={t('sharedLink')}
              slotProps={{ input: { readOnly: true } }}
            />
          </AccordionDetails>
        </Accordion>
        <div className={classes.buttons}>
          <Button type="button" color="primary" variant="outlined" onClick={() => navigate(-1)}>
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
