import React, { useState } from 'react';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation, useTranslationKeys } from '../common/components/LocalizationProvider';
import EditItemView from './components/EditItemView';
import { prefixString, unprefixString } from '../common/util/stringUtils';
import SelectField from '../common/components/SelectField';
import SettingsMenu from './components/SettingsMenu';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const NotificationPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const alarms = useTranslationKeys((it) => it.startsWith('alarm')).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  const validate = () => item && item.type && item.notificators;

  return (
    <EditItemView
      endpoint="notifications"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedNotification']}
    >
      {item && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <SelectField
              value={item.type}
              emptyValue={null}
              onChange={(e) => setItem({ ...item, type: e.target.value })}
              endpoint="/api/notifications/types"
              keyGetter={(it) => it.type}
              titleGetter={(it) => t(prefixString('event', it.type))}
              label={t('sharedType')}
            />
            <SelectField
              multiple
              value={item.notificators ? item.notificators.split(/[, ]+/) : []}
              onChange={(e) => setItem({ ...item, notificators: e.target.value.join() })}
              endpoint="/api/notifications/notificators"
              keyGetter={(it) => it.type}
              titleGetter={(it) => t(prefixString('notificator', it.type))}
              label={t('notificationNotificators')}
            />
            {item.type === 'alarm' && (
              <SelectField
                multiple
                value={item.attributes && item.attributes.alarms ? item.attributes.alarms.split(/[, ]+/) : []}
                onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, alarms: e.target.value.join() } })}
                data={alarms}
                keyGetter={(it) => it.key}
                label={t('sharedAlarms')}
              />
            )}
            <FormGroup>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={item.always}
                    onChange={(event) => setItem({ ...item, always: event.target.checked })}
                  />
                  )}
                label={t('notificationAlways')}
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}
    </EditItemView>
  );
};

export default NotificationPage;
