import React from 'react';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';

const ReportCard = ({ title, children }) => {

  return (
    <Card>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default ReportCard;
