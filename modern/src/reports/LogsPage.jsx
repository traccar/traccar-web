import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableRow, TableCell, TableHead, TableBody,
} from '@mui/material';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import { sessionActions } from '../store';

const LogsPage = () => {
  const dispatch = useDispatch();
  const t = useTranslation();

  useEffect(() => {
    dispatch(sessionActions.enableLogs(true));
    return () => dispatch(sessionActions.enableLogs(false));
  }, []);

  const items = useSelector((state) => state.session.logs);

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('deviceIdentifier')}</TableCell>
            <TableCell>{t('positionProtocol')}</TableCell>
            <TableCell>{t('commandData')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.uniqueId}</TableCell>
              <TableCell>{item.port}</TableCell>
              <TableCell>{item.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default LogsPage;
