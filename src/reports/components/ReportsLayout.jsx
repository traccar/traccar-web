import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import ReportsMenu from './ReportsMenu';

const routes = {
  combined: 'reportCombined',
  route: 'reportRoute',
  event: 'reportEvents',
  trip: 'reportTrips',
  stop: 'reportStops',
  summary: 'reportSummary',
  chart: 'reportChart',
  logs: 'statisticsTitle',
  scheduled: 'reportScheduled',
  statistics: 'statisticsTitle',
};

const ReportsLayout = () => {
  const { pathname } = useLocation();
  const pathSegmets = pathname.split('/').filter((p) => p !== '');

  return (
    <PageLayout
      menu={<ReportsMenu />}
      breadcrumbs={['reportTitle', routes[pathSegmets[1]]]}
    >
      <Outlet />
    </PageLayout>
  );
};

export default ReportsLayout;
