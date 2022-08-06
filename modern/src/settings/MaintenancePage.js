import React, { useState } from 'react';
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
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const MaintenancePage = () => {
  const classes = useStyles();
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
      if (value.type === 'number') {
        otherList.push({ key, name: value.name, type: value.type });
      }
    });
    return otherList;
  };

  const onMaintenanceTypeChange = (event) => {
    const newValue = event.target.value;
    setItem({
      ...item, type: newValue, start: 0, period: 0,
    });

    const attribute = positionAttributes[newValue];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'distance':
          setLabels({ ...labels, start: t(prefixString('shared', distanceUnit)), period: t(prefixString('shared', distanceUnit)) });
          break;
        case 'speed':
          setLabels({ ...labels, start: t(prefixString('shared', speedUnit)), period: t(prefixString('shared', speedUnit)) });
          break;
        default:
          setLabels({ ...labels, start: null, period: null });
          break;
      }
    } else {
      setLabels({ ...labels, start: null, period: null });
    }
  };

  const rawToValue = (value) => {
    const attribute = positionAttributes[item.type];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedFromKnots(value, speedUnit);
        case 'distance':
          return distanceFromMeters(value, distanceUnit);
        default:
          return value;
      }
    }
    return value;
  };

  const valueToRaw = (value) => {
    const attribute = positionAttributes[item.type];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedToKnots(value, speedUnit);
        case 'distance':
          return distanceToMeters(value, distanceUnit);
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
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
              />
              <FormControl>
                <InputLabel>{t('sharedType')}</InputLabel>
                <Select
                  label={t('sharedType')}
                  value={item.type || ''}
                  onChange={onMaintenanceTypeChange}
                >
                  {convertToList(positionAttributes).map(({ key, name }) => (
                    <MenuItem key={key} value={key}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                value={rawToValue(item.start) || ''}
                onChange={(event) => setItem({ ...item, start: valueToRaw(event.target.value) })}
                label={labels.start ? `${t('maintenanceStart')} (${labels.start})` : t('maintenanceStart')}
              />
              <TextField
                type="number"
                value={rawToValue(item.period) || ''}
                onChange={(event) => setItem({ ...item, period: valueToRaw(event.target.value) })}
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
