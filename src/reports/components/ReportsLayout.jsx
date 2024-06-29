import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import ReportsMenu from './ReportsMenu';

const reportsPaths = {
  '/reports/combined': ['reportTitle', 'reportCombined'],
  '/reports/route': ['reportTitle', 'reportRoute'],
  '/reports/event': ['reportTitle', 'reportEvents'],
  '/reports/trip': ['reportTitle', 'reportTrips'],
  '/reports/stop': ['reportTitle', 'reportStops'],
  '/reports/summary': ['reportTitle', 'reportSummary'],
  '/reports/chart': ['reportTitle', 'reportChart'],
  '/reports/logs': ['reportTitle', 'statisticsTitle'],
  '/reports/scheduled': ['settingsTitle', 'reportScheduled'],
  '/reports/statistics': ['reportTitle', 'statisticsTitle'],
};

const ReportsLayout = () => {
  const { pathname } = useLocation();

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={[...reportsPaths[pathname]]}>
      <Outlet />
    </PageLayout>
  );
};

export default ReportsLayout;
