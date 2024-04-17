import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { prefixString } from '../common/util/stringUtils';
import EditItemView from './components/EditItemView';
import EditAttributesAccordion from './components/EditAttributesAccordion';
import { useAttributePreference } from '../common/util/preferences';
import {
  speedFromKnots, speedToKnots, distanceFromMeters, distanceToMeters,
} from '../common/util/converter';
import { useTranslation } from '../common/components/LocalizationProvider';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import SettingsMenu from './components/SettingsMenu';
import useSettingsStyles from './common/useSettingsStyles';

const MaintenancePage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [item, setItem] = useState();
  const [labels, setLabels] = useState({ start: '', period: '' });

  const speedUnit = useAttributePreference('speedUnit', 'kn');
  const distanceUnit = useAttributePreference('distanceUnit', 'km');

  const convertToList = (attributes) => {
    const otherList = [];
    Object.keys(attributes).forEach((key) => {
      const value = attributes[key];
      if (value.type === 'number' || key.endsWith('Time')) {
        otherList.push({ key, name: value.name, type: value.type });
      }
    });
    return otherList;
  };

  useEffect(() => {
    const attribute = positionAttributes[item?.type];
    if (item?.type?.endsWith('Time')) {
      setLabels({ ...labels, start: null, period: t('sharedDays') });
    } else if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          setLabels({ ...labels, start: t(prefixString('shared', speedUnit)), period: t(prefixString('shared', speedUnit)) });
          break;
        case 'distance':
          setLabels({ ...labels, start: t(prefixString('shared', distanceUnit)), period: t(prefixString('shared', distanceUnit)) });
          break;
        case 'hours':
          setLabels({ ...labels, start: t('sharedHours'), period: t('sharedHours') });
          break;
        default:
          setLabels({ ...labels, start: null, period: null });
          break;
      }
    } else {
      setLabels({ ...labels, start: null, period: null });
    }
  }, [item?.type]);

  const rawToValue = (start, value) => {
    const attribute = positionAttributes[item.type];
    if (item.type?.endsWith('Time')) {
      if (start) {
        return dayjs(value).locale('en').format('YYYY-MM-DD');
      }
      return value / 86400000;
    }
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedFromKnots(value, speedUnit);
        case 'distance':
          return distanceFromMeters(value, distanceUnit);
        case 'hours':
          return value / 3600000;
        default:
          return value;
      }
    }
    return value;
  };

  const valueToRaw = (start, value) => {
    const attribute = positionAttributes[item.type];
    if (item.type?.endsWith('Time')) {
      if (start) {
        return dayjs(value, 'YYYY-MM-DD').valueOf();
      }
      return value * 86400000;
    } if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedToKnots(value, speedUnit);
        case 'distance':
          return distanceToMeters(value, distanceUnit);
        case 'hours':
          return value * 3600000;
        default:
          return value;
      }
    }
    return value;
  };

  const validate = () => item && item.name && item.type && item.start && item.period;

  return (
    <EditItemView
      endpoint="maintenance"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedMaintenance']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ''}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                label={t('sharedName')}
              />
              <FormControl>
                <InputLabel>{t('sharedType')}</InputLabel>
                <Select
                  label={t('sharedType')}
                  value={item.type || ''}
                  onChange={(e) => setItem({ ...item, type: e.target.value, start: 0, period: 0 })}
                >
                  {convertToList(positionAttributes).map(({ key, name }) => (
                    <MenuItem key={key} value={key}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type={item.type?.endsWith('Time') ? 'date' : 'number'}
                value={rawToValue(true, item.start) || ''}
                onChange={(e) => setItem({ ...item, start: valueToRaw(true, e.target.value) })}
                label={labels.start ? `${t('maintenanceStart')} (${labels.start})` : t('maintenanceStart')}
              />
              <TextField
                type="number"
                value={rawToValue(false, item.period) || ''}
                onChange={(e) => setItem({ ...item, period: valueToRaw(false, e.target.value) })}
                label={labels.period ? `${t('maintenancePeriod')} (${labels.period})` : t('maintenancePeriod')}
              />
            </AccordionDetails>
          </Accordion>
          <EditAttributesAccordion
            attributes={item.attributes}
            setAttributes={(attributes) => setItem({ ...item, attributes })}
            definitions={{}}
          />
        </>
      )}
    </EditItemView>
  );
};

export default MaintenancePage;
