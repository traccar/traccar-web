import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkField from '../common/components/LinkField';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from './components/SettingsMenu';
import { formatNotificationTitle } from '../common/util/formatter';
import PageLayout from '../common/components/PageLayout';
import useSettingsStyles from './common/useSettingsStyles';

const UserConnectionsPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const { id } = useParams();

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'settingsUser', 'sharedConnections']}
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
              endpointAll="/api/devices?all=true"
              endpointLinked={`/api/devices?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="deviceId"
              titleGetter={(it) => `${it.name} (${it.uniqueId})`}
              label={t('deviceTitle')}
            />
            <LinkField
              endpointAll="/api/groups?all=true"
              endpointLinked={`/api/groups?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="groupId"
              label={t('settingsGroups')}
            />
            <LinkField
              endpointAll="/api/geofences?all=true"
              endpointLinked={`/api/geofences?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="geofenceId"
              label={t('sharedGeofences')}
            />
            <LinkField
              endpointAll="/api/notifications?all=true"
              endpointLinked={`/api/notifications?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="notificationId"
              titleGetter={(it) => formatNotificationTitle(t, it, true)}
              label={t('sharedNotifications')}
            />
            <LinkField
              endpointAll="/api/calendars?all=true"
              endpointLinked={`/api/calendars?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="calendarId"
              label={t('sharedCalendars')}
            />
            <LinkField
              endpointAll="/api/users?all=true"
              endpointLinked={`/api/users?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="managedUserId"
              label={t('settingsUsers')}
            />
            <LinkField
              endpointAll="/api/attributes/computed?all=true"
              endpointLinked={`/api/attributes/computed?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="attributeId"
              titleGetter={(it) => it.description}
              label={t('sharedComputedAttributes')}
            />
            <LinkField
              endpointAll="/api/drivers?all=true"
              endpointLinked={`/api/drivers?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="driverId"
              titleGetter={(it) => `${it.name} (${it.uniqueId})`}
              label={t('sharedDrivers')}
            />
            <LinkField
              endpointAll="/api/commands?all=true"
              endpointLinked={`/api/commands?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="commandId"
              titleGetter={(it) => it.description}
              label={t('sharedSavedCommands')}
            />
            <LinkField
              endpointAll="/api/maintenance?all=true"
              endpointLinked={`/api/maintenance?userId=${id}`}
              baseId={id}
              keyBase="userId"
              keyLink="maintenanceId"
              label={t('sharedMaintenance')}
            />
          </AccordionDetails>
        </Accordion>
      </Container>
    </PageLayout>
  );
};

export default UserConnectionsPage;
