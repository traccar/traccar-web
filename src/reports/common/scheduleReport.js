export default async (deviceIds, groupIds, report) => {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  if (response.ok) {
    report = await response.json();
    if (deviceIds.length) {
      await fetch('/api/permissions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceIds.map((id) => ({ deviceId: id, reportId: report.id }))),
      });
    }
    if (groupIds.length) {
      await fetch('/api/permissions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupIds.map((id) => ({ groupId: id, reportId: report.id }))),
      });
    }
    return null;
  }
  return response.text();
};
