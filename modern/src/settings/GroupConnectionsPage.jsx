import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkField from '../common/components/LinkField';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from './components/SettingsMenu';
import { formatNotificationTitle } from '../common/util/formatter';
import PageLayout from '../common/components/PageLayout';
import useFeatures from '../common/util/useFeatures';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const GroupConnectionsPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const { id } = useParams();

  const features = useFeatures();

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'groupDialog', 'sharedConnections']}
    >
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedConnections')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <LinkField
              endpointAll="/api/geofences"
              endpointLinked={`/api/geofences?groupId=${id}`}
              baseId={id}
              keyBase="groupId"
              keyLink="geofenceId"
              label={t('sharedGeofences')}
            />
            <LinkField
              endpointAll="/api/notifications"
              endpointLinked={`/api/notifications?groupId=${id}`}
              baseId={id}
              keyBase="groupId"
              keyLink="notificationId"
              titleGetter={(it) => formatNotificationTitle(t, it)}
              label={t('sharedNotifications')}
            />
            {!features.disableDrivers && (
              <LinkField
                endpointAll="/api/drivers"
                endpointLinked={`/api/drivers?groupId=${id}`}
                baseId={id}
                keyBase="groupId"
                keyLink="driverId"
                label={t('sharedDrivers')}
              />
            )}
            {!features.disableComputedAttributes && (
              <LinkField
                endpointAll="/api/attributes/computed"
                endpointLinked={`/api/attributes/computed?groupId=${id}`}
                baseId={id}
                keyBase="groupId"
                keyLink="attributeId"
                titleGetter={(it) => it.description}
                label={t('sharedComputedAttributes')}
              />
            )}
            <LinkField
              endpointAll="/api/commands"
              endpointLinked={`/api/commands?groupId=${id}`}
              baseId={id}
              keyBase="groupId"
              keyLink="commandId"
              titleGetter={(it) => it.description}
              label={t('sharedSavedCommands')}
            />
            {!features.disableMaintenance && (
              <LinkField
                endpointAll="/api/maintenance"
                endpointLinked={`/api/maintenance?groupId=${id}`}
                baseId={id}
                keyBase="groupId"
                keyLink="maintenanceId"
                label={t('sharedMaintenance')}
              />
            )}
          </AccordionDetails>
        </Accordion>
      </Container>
    </PageLayout>
  );
};

export default GroupConnectionsPage;
