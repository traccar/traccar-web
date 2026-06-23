import { useCallback, useReducer, useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { useAsyncTask, useScrollToLoad, pageSize } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionFab from './components/CollectionFab';
import CollectionActions from './components/CollectionActions';
import TableShimmer from '../common/components/TableShimmer';
import SearchHeader from './components/SearchHeader';
import useSettingsStyles from './common/useSettingsStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';

const ComputedAttributesPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const administrator = useAdministrator();

  const loadItems = useCallback(
    async (offset, signal) => {
      const query = new URLSearchParams({ limit: pageSize, offset });
      if (searchKeyword) {
        query.append('keyword', searchKeyword);
      }
      const response = await fetchOrThrow(`/api/attributes/computed?${query.toString()}`, {
        signal,
      });
      const data = await response.json();
      setItems((previous) => (offset ? [...previous, ...data] : data));
      setHasMore(data.length >= pageSize);
    },
    [searchKeyword],
  );

  const sentinelRef = useScrollToLoad(() => loadItems(items.length));

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setItems([]);
      await loadItems(0, signal);
    },
    [reloadKey, loadItems],
  );

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedComputedAttributes']}>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedDescription')}</TableCell>
            <TableCell>{t('sharedAttribute')}</TableCell>
            <TableCell>{t('sharedExpression')}</TableCell>
            <TableCell>{t('sharedType')}</TableCell>
            {administrator && <TableCell className={classes.columnAction} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.attribute}</TableCell>
              <TableCell>{item.expression}</TableCell>
              <TableCell>{item.type}</TableCell>
              {administrator && (
                <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions
                    itemId={item.id}
                    editPath="/settings/attribute"
                    endpoint="attributes/computed"
                    onReload={reload}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
          {hasMore && (
            <TableShimmer
              ref={items.length > 0 ? sentinelRef : null}
              columns={administrator ? 5 : 4}
              endAction={administrator}
            />
          )}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/attribute" disabled={!administrator} />
    </PageLayout>
  );
};

export default ComputedAttributesPage;
