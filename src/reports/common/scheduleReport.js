import fetchOrThrow from "../../common/util/fetchOrThrow";

export default async (deviceIds, groupIds, report) => {
  const response = await fetchOrThrow('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  report = await response.json();
  if (deviceIds.length) {
    await fetchOrThrow('/api/permissions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceIds.map((id) => ({ deviceId: id, reportId: report.id }))),
    });
  }
  if (groupIds.length) {
    await fetchOrThrow('/api/permissions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupIds.map((id) => ({ groupId: id, reportId: report.id }))),
    });
  }
  return null;
};
