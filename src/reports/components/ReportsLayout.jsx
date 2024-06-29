import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import ReportsMenu from './ReportsMenu';

const reportsPaths = {
  '/reports/combined': 'reportCombined',
  '/reports/route': 'reportRoute',
  '/reports/event': 'reportEvents',
  '/reports/trip': 'reportTrips',
  '/reports/stop': 'reportStops',
  '/reports/summary': 'reportSummary',
  '/reports/chart': 'reportChart',
  '/reports/logs': 'statisticsTitle',
  '/reports/scheduled': 'reportScheduled',
  '/reports/statistics': 'statisticsTitle',
};

const ReportsLayout = () => {
  const { pathname } = useLocation();

  return (
    <PageLayout
      menu={<ReportsMenu />}
      breadcrumbs={['reportTitle', reportsPaths[pathname] || '']}
    >
      <Outlet />
    </PageLayout>
  );
};

export default ReportsLayout;
