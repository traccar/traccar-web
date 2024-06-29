import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import ReportsMenu from './ReportsMenu';

const routes = {
  reports: {
    combined: ['reportTitle', 'reportCombined'],
    route: ['reportTitle', 'reportRoute'],
    event: ['reportTitle', 'reportEvents'],
    trip: ['reportTitle', 'reportTrips'],
    stop: ['reportTitle', 'reportStops'],
    summary: ['reportTitle', 'reportSummary'],
    chart: ['reportTitle', 'reportChart'],
    logs: ['reportTitle', 'statisticsTitle'],
    scheduled: ['settingsTitle', 'reportScheduled'],
    statistics: ['reportTitle', 'statisticsTitle'],
  },
};

const ReportsLayout = () => {
  const { pathname } = useLocation();
  const pathSegmets = pathname.split('/').filter((p) => p !== '');

  return (
    <PageLayout
      menu={<ReportsMenu />}
      breadcrumbs={[...routes[pathSegmets[0]][pathSegmets[1]]]}
    >
      <Outlet />
    </PageLayout>
  );
};

export default ReportsLayout;
