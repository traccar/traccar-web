import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AppBar,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAsyncTask, useCatch } from '../reactHelper';
import { prefixString } from '../common/util/stringUtils';
import fetchOrThrow from '../common/util/fetchOrThrow';

const UnsubscribePage = () => {
  const t = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const query = new URLSearchParams({ token }).toString();
  const [items, setItems] = useState(null);

  useAsyncTask(
    async ({ signal }) => {
      const response = await fetchOrThrow(`api/unsubscribe?${query}`, { signal });
      setItems(await response.json());
    },
    [query],
  );

  const handleRemove = useCatch(async (id) => {
    await fetchOrThrow(`api/unsubscribe/${id}?${query}`, { method: 'DELETE' });
    setItems((previous) => previous.filter((item) => item.id !== id));
  });

  return (
    <main>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6">{t('sharedNotifications')}</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <List>
          {items === null
            ? Array.from({ length: 3 }, (_, i) => (
                <ListItem key={i}>
                  <ListItemText primary={<Skeleton />} />
                </ListItem>
              ))
            : items.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Button onClick={() => handleRemove(item.id)}>{t('sharedRemove')}</Button>
                  }
                >
                  <ListItemText primary={item.description || t(prefixString('event', item.type))} />
                </ListItem>
              ))}
        </List>
      </Container>
    </main>
  );
};

export default UnsubscribePage;
