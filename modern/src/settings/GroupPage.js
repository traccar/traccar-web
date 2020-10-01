import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from '../common/localization';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControl, InputLabel, Select } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from '../attributes/EditAttributesView';
import { useEffectAsync } from '../reactHelper';
import deviceAttributes from '../attributes/deviceAttributes';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const GroupPage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();
  const [groups, setGroups] = useState();

  useEffectAsync(async () => {
    const response = await fetch('/api/groups');
    if (response.ok) {
      setGroups(await response.json());
    }
  }, []);

  return (
    <EditItemView endpoint="groups" item={item} setItem={setItem}>
      {item &&
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                margin="normal"
                defaultValue={item.name}
                onChange={event => setItem({...item, name: event.target.value})}
                label={t('sharedName')}
                variant="filled" />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedExtra')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              {groups &&
                <FormControl margin="normal" variant="filled">
                  <InputLabel>{t('groupParent')}</InputLabel>
                  <Select
                    native
                    defaultValue={item.groupId}
                    onChange={event => setItem({...item, groupId: Number(event.target.value)})}>
                    <option value={0}></option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </Select>
                </FormControl>
              }
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedAttributes')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <EditAttributesView
                attributes={item.attributes}
                setAttributes={attributes => setItem({...item, attributes})}
                definitions={deviceAttributes}
                />
            </AccordionDetails>
          </Accordion>
        </>
      }
    </EditItemView>
  );
}

export default GroupPage;
