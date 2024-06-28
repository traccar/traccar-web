import React from 'react';
import { Outlet } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import ReportsMenu from './ReportsMenu';

const ReportsLayout = () => (
  <PageLayout
    menu={<ReportsMenu />}
    breadcrumbs={['reportTitle', 'reportCombined']}
  >
    <Outlet />
  </PageLayout>
);

export default ReportsLayout;
