import React, { Fragment, useState } from 'react';

import t from './common/localization';
import { makeStyles, Typography, ListItem, ListItemText, ListItemSecondaryAction, List, Container, Paper, Divider } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useEffectAsync } from './reactHelper';
import MainToolbar from './MainToolbar';
import { formatPosition } from './common/formatter';
import { prefixString } from './common/stringUtils';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const PositionPage = () => {
  const classes = useStyles();

  const { id } = useParams();

  const [item, setItem] = useState();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/positions?id=${id}`, {
        headers: {
          'Accept': 'application/json'
        },
      });
      if (response.ok) {
        const items = await response.json();
        setItem(items[0]);
      }
    } else {
      setItem({});
    }
  }, [id]);

  const formatKey = (key) => {
    return t(prefixString('position', key)) || `${t('sharedAttribute')} "${key}"`;
  };

  const attributesList = () => {
    const combinedList = {...item, ...item.attributes};
    return Object.entries(combinedList).filter(([_, value]) => typeof value !== 'object');
  }

  return (
    <>
      <MainToolbar />
      <Container maxWidth='sm' className={classes.root}>
        <Paper>
          {item &&
            <List>
              {attributesList().map(([key, value], index, list) => (
                <Fragment key={key}>
                  <ListItem>
                    <ListItemText
                      primary={formatKey(key)}
                      />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {formatPosition(value, key)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < list.length - 1 ? <Divider /> : null}
                </Fragment>
              ))}
            </List>
          }
        </Paper>
      </Container>
    </>
  );
}

export default PositionPage;
