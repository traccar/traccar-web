import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { useCatch, useEffectAsync } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
}));

const EditItemView = ({
  children, endpoint, item, setItem, defaultItem, validate, onItemSaved, menu, breadcrumbs,
}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const t = useTranslation();

  const { id } = useParams();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/${endpoint}/${id}`);
      if (response.ok) {
        setItem(await response.json());
      } else {
        throw Error(await response.text());
      }
    } else {
      setItem(defaultItem || {});
    }
  }, [id]);

  const handleSave = useCatch(async () => {
    let url = `/api/${endpoint}`;
    if (id) {
      url += `/${id}`;
    }

    const response = await fetch(url, {
      method: !id ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      if (onItemSaved) {
        onItemSaved(await response.json());
      }
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={menu} breadcrumbs={breadcrumbs}>
      <Container maxWidth="xs" className={classes.container}>
        {children}
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
            onClick={handleSave}
            disabled={!validate()}
          >
            {t('sharedSave')}
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
};

export default EditItemView;
