import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Table, TableHead, TableRow, TableBody, TableCell,
} from '@mui/material';
import {
  formatDistance, formatSpeed, formatTime, formatNumericHours,
} from '../common/util/formatter';
import dayjs from 'dayjs';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ColumnSelect from './components/ColumnSelect';
import usePersistedState from '../common/util/usePersistedState';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import scheduleReport from './common/scheduleReport';
import fetchOrThrow from '../common/util/fetchOrThrow';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuration for Trips Summary API - uses a different server
const TRIPS_SUMMARY_API_BASE_URL = 'http://amserver.amsonsoft.com:8000';

const columnsArray = [
  ['effDate', 'reportStartDate'],
  ['autocalcKmTraveled', 'reportAutocalcKmTraveled'],
  ['jumpscalcKmTraveled', 'reportJumpscalcKmTraveled'],
  ['manualKmTraveled', 'reportManualKmTraveled'],
  ['autocalcTravelTime', 'reportAutocalcTravelTime'],
  ['manualDayDuration', 'reportManualDayDuration'],
  ['maxSpeedKmh', 'reportMaximumSpeed'],
  ['avgSpeedKmh', 'reportAverageSpeed'],
  ['totalStops', 'reportTotalStops'],
];
const columnsMap = new Map(columnsArray);

// Parse date string to match EXACTLY what formatTime displays in the browser
// formatTime does: dayjs(value).toDate().toLocaleDateString()
// This shows the date in local timezone. We need Excel to show the same date.
//
// CRITICAL FIX: We need to use the SAME logic as formatTime to get the date
// that the browser displays, then create a date that Excel will show the same way.
const parseDateForExcel = (dateString) => {
  if (!dateString) return null;
  
  // Use dayjs to parse the date string (same as formatTime does)
  // This ensures we get the exact same Date object that formatTime uses
  const d = dayjs(dateString).toDate();
  
  // Get what toLocaleDateString() would show by extracting the date components
  // from the local representation of this date
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  
  // CRITICAL FIX: Create a UTC date with these date components at noon UTC
  // This ensures that when ExcelJS processes it (which may convert to UTC),
  // Excel will display the correct date. Using UTC avoids timezone conversion
  // issues that cause the date to shift by one day.
  // The date part (year, month, day) matches what the browser shows via toLocaleDateString()
  const utcDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
  
  return utcDate;
};

const TripsSummaryPage = () => {
  const navigate = useNavigate();
  const { classes } = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');

  const [columns, setColumns] = usePersistedState('tripsSummaryColumns', ['effDate', 'autocalcKmTraveled', 'manualKmTraveled', 'avgSpeedKmh']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format dates for the API (YYYY-MMM-DD format)
  const formatDateForApi = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert time interval object to milliseconds
  const intervalToMilliseconds = (interval) => {
    if (!interval || typeof interval !== 'object') return 0;
    const days = interval.days || 0;
    const hours = interval.hours || 0;
    const minutes = interval.minutes || 0;
    const seconds = interval.seconds || 0;
    return (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
  };

  // Transform API response from snake_case to camelCase and convert types
  const transformItem = (item) => ({
    effDate: item.eff_date,
    person: item.person,
    autocalcKmTraveled: parseFloat(item.autocalc_km_traveled) || 0,
    jumpscalcKmTraveled: parseFloat(item.jumpscalc_km_traveled) || 0,
    manualKmTraveled: parseFloat(item.manual_km_traveled) || 0,
    autocalcTravelTime: intervalToMilliseconds(item.autocalc_travel_time),
    manualDayDuration: intervalToMilliseconds(item.manual_day_duration),
    maxSpeedKmh: parseFloat(item.max_speed_kmh) || 0,
    avgSpeedKmh: parseFloat(item.avg_speed_kmh) || 0,
    totalStops: parseInt(item.total_stops, 10) || 0,
  });

  const onShow = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const fromDate = formatDateForApi(from);
    const toDate = formatDateForApi(to);
    const deviceIdsStr = deviceIds.join(',');
    
    // Build URL: /api/reports/tripssummary/2025-Nov-01,2025-Nov-11,53,30
    const url = `${TRIPS_SUMMARY_API_BASE_URL}/api/reports/tripssummary/${fromDate},${toDate},${deviceIdsStr}`;
    
    setLoading(true);
    try {
      const response = await fetchOrThrow(url, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      setItems(data.map(transformItem));
    } finally {
      setLoading(false);
    }
  });

  const onExport = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const fromDate = formatDateForApi(from);
    const toDate = formatDateForApi(to);
    
    // If we have items in state, generate Excel from them
    if (items.length > 0) {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(t('reportTripsSummary'));
        
        // Add title row
        const titleRow = worksheet.addRow([t('reportTripsSummary')]);
        worksheet.mergeCells(1, 1, 1, columns.length + 1);
        titleRow.font = { bold: true, size: 14 };
        titleRow.alignment = { horizontal: 'center' };
        
        // Add headers
        const headers = [t('sharedDevice'), ...columns.map((key) => t(columnsMap.get(key)))];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' },
        };
        headerRow.alignment = { horizontal: 'center' };
        
        // Find the index of the date column for formatting
        const dateColumnIndex = columns.indexOf('effDate');
        
        // Add data rows
        items.forEach((item) => {
          const rowData = [
            item.person,
            ...columns.map((key) => {
              const value = item[key];
              // Format the value for Excel (use raw values, not formatted strings)
              switch (key) {
                case 'effDate':
                  return value ? parseDateForExcel(value) : null;
                case 'autocalcKmTraveled':
                case 'jumpscalcKmTraveled':
                case 'manualKmTraveled':
                  return value != null ? value : 0;
                case 'autocalcTravelTime':
                case 'manualDayDuration':
                  // Convert milliseconds to hours for Excel
                  return value != null ? value / 3600000 : 0;
                case 'maxSpeedKmh':
                case 'avgSpeedKmh':
                  return value != null ? value : 0;
                case 'totalStops':
                  return value != null ? value : 0;
                default:
                  return value || '';
              }
            }),
          ];
          const row = worksheet.addRow(rowData);
          
          // Set date format for date column if it exists
          if (dateColumnIndex >= 0 && rowData[dateColumnIndex + 1]) {
            const dateCell = row.getCell(dateColumnIndex + 2); // +2 because device is column 1
            dateCell.numFmt = 'mm/dd/yyyy'; // Set explicit date format
            
            // Set the date value - parseDateForExcel returns a UTC Date object
            // that matches what the browser displays
            const dateValue = rowData[dateColumnIndex + 1];
            if (dateValue instanceof Date) {
              // Set the date value directly - it's already a UTC date with correct date components
              dateCell.value = dateValue;
            }
          }
        });
        
        // Auto-size columns and set date format
        worksheet.columns.forEach((column, index) => {
          column.width = 15;
          // Set date format for date column header
          if (columns[index] === 'effDate') {
            column.numFmt = 'mm/dd/yyyy';
          }
        });
        
        // Generate and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob(
          [buffer],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        );
        saveAs(blob, `trips-summary-${fromDate}-${toDate}.xlsx`);
        return;
      } catch (error) {
        console.error('Error generating Excel file:', error);
        alert(`Failed to generate Excel file: ${error.message}`);
        return;
      }
    }
    
    // Fallback: Try to fetch from server if no items in state
    const deviceIdsStr = deviceIds.join(',');
    const url = `${TRIPS_SUMMARY_API_BASE_URL}/api/reports/tripssummary/xlsx/${fromDate},${toDate},${deviceIdsStr}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
      
      const contentType = response.headers.get('content-type') || '';
      const isExcel = contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
        contentType.includes('application/vnd.ms-excel') ||
        contentType.includes('application/octet-stream');
      
      if (!response.ok || !isExcel) {
        // Server doesn't support Excel export, generate from JSON
        const jsonResponse = await fetch(`${TRIPS_SUMMARY_API_BASE_URL}/api/reports/tripssummary/${fromDate},${toDate},${deviceIdsStr}`);
        const jsonData = await jsonResponse.json();
        const transformedItems = jsonData.map(transformItem);
        
        // Generate Excel from JSON data
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(t('reportTripsSummary'));
        
        const headers = [t('sharedDevice'), ...columns.map((key) => t(columnsMap.get(key)))];
        worksheet.addRow(headers).font = { bold: true };
        
        // Find the index of the date column for formatting
        const dateColumnIndex = columns.indexOf('effDate');
        
        transformedItems.forEach((item) => {
          const rowData = [
            item.person,
            ...columns.map((key) => {
              const value = item[key];
              switch (key) {
                case 'effDate':
                  return value ? parseDateForExcel(value) : null;
                case 'autocalcKmTraveled':
                case 'jumpscalcKmTraveled':
                case 'manualKmTraveled':
                  return value != null ? value : 0;
                case 'autocalcTravelTime':
                case 'manualDayDuration':
                  return value != null ? value / 3600000 : 0;
                case 'maxSpeedKmh':
                case 'avgSpeedKmh':
                  return value != null ? value : 0;
                case 'totalStops':
                  return value != null ? value : 0;
                default:
                  return value || '';
              }
            }),
          ];
          const row = worksheet.addRow(rowData);
          
          // Set date format for date column if it exists
          if (dateColumnIndex >= 0 && rowData[dateColumnIndex + 1]) {
            const dateCell = row.getCell(dateColumnIndex + 2); // +2 because device is column 1
            dateCell.numFmt = 'mm/dd/yyyy'; // Set explicit date format
            
            // Set the date value - parseDateForExcel returns a UTC Date object
            // that matches what the browser displays
            const dateValue = rowData[dateColumnIndex + 1];
            if (dateValue instanceof Date) {
              // Set the date value directly - it's already a UTC date with correct date components
              dateCell.value = dateValue;
            }
          }
        });
        
        // Set date format for date column header
        worksheet.columns.forEach((column, index) => {
          if (columns[index] === 'effDate') {
            column.numFmt = 'mm/dd/yyyy';
          }
        });
        
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `trips-summary-${fromDate}-${toDate}.xlsx`);
        return;
      }
      
      // Server returned Excel file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `trips-summary-${fromDate}-${toDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Excel export error:', error);
      alert(`Failed to export Excel file: ${error.message}`);
    }
  });

  const onExportPdf = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const fromDate = formatDateForApi(from);
    const toDate = formatDateForApi(to);
    
    // Helper function to format values for PDF display
    const formatValueForPdf = (item, key) => {
      const value = item[key];
      switch (key) {
        case 'effDate':
          return value ? formatTime(value, 'date') : '';
        case 'autocalcKmTraveled':
        case 'jumpscalcKmTraveled':
        case 'manualKmTraveled':
          return value != null && value > 0 ? formatDistance(value * 1000, distanceUnit, t) : '';
        case 'autocalcTravelTime':
        case 'manualDayDuration':
          return value != null && value > 0 ? formatNumericHours(value, t) : '';
        case 'maxSpeedKmh':
        case 'avgSpeedKmh':
          return value != null && value > 0 ? formatSpeed(value / 1.852, speedUnit, t) : '';
        case 'totalStops':
          return value != null ? String(value) : '0';
        default:
          return value || '';
      }
    };
    
    // If we have items in state, generate PDF from them
    if (items.length > 0) {
      try {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text(t('reportTripsSummary'), 14, 15);
        
        // Prepare table data
        const tableData = items.map((item) => {
          const row = [item.person];
          columns.forEach((key) => {
            row.push(formatValueForPdf(item, key));
          });
          return row;
        });
        
        // Prepare table headers
        const tableHeaders = [t('sharedDevice'), ...columns.map((key) => t(columnsMap.get(key)))];
        
        // Add table
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
          startY: 25,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [224, 224, 224], textColor: [0, 0, 0], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 25 },
        });
        
        // Save PDF
        doc.save(`trips-summary-${fromDate}-${toDate}.pdf`);
        return;
      } catch (error) {
        console.error('Error generating PDF file:', error);
        alert(`Failed to generate PDF file: ${error.message}`);
        return;
      }
    }
    
    // Fallback: Try to fetch from server if no items in state
    const deviceIdsStr = deviceIds.join(',');
    const url = `${TRIPS_SUMMARY_API_BASE_URL}/api/reports/tripssummary/pdf/${fromDate},${toDate},${deviceIdsStr}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      });
      
      // Check content type first (before reading body)
      const contentType = response.headers.get('content-type') || '';
      const isPdf = contentType.includes('application/pdf') ||
        contentType.includes('application/octet-stream');
      
      if (!response.ok || !isPdf) {
        // Server doesn't support PDF export, generate from JSON
        const jsonResponse = await fetch(`${TRIPS_SUMMARY_API_BASE_URL}/api/reports/tripssummary/${fromDate},${toDate},${deviceIdsStr}`);
        const jsonData = await jsonResponse.json();
        const transformedItems = jsonData.map(transformItem);
        
        // Generate PDF from JSON data
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text(t('reportTripsSummary'), 14, 15);
        
        // Prepare table data
        const tableData = transformedItems.map((item) => {
          const row = [item.person];
          columns.forEach((key) => {
            row.push(formatValueForPdf(item, key));
          });
          return row;
        });
        
        // Prepare table headers
        const tableHeaders = [t('sharedDevice'), ...columns.map((key) => t(columnsMap.get(key)))];
        
        // Add table
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
          startY: 25,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [224, 224, 224], textColor: [0, 0, 0], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 25 },
        });
        
        // Save PDF
        doc.save(`trips-summary-${fromDate}-${toDate}.pdf`);
        return;
      }
      
      // Server returned PDF file
      const blob = await response.blob();
      
      // Verify blob is not empty
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // Check if blob might be HTML/JSON (error page)
      const blobStart = await blob.slice(0, 100).text();
      if (blobStart.trim().startsWith('<') || blobStart.trim().startsWith('{') || blobStart.trim().startsWith('[')) {
        throw new Error(`Server returned error page instead of PDF file: ${blobStart.substring(0, 200)}`);
      }
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `trips-summary-${fromDate}-${toDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('PDF export error:', error);
      alert(`Failed to export PDF file: ${error.message}`);
    }
  });

  const onSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'trips-summary';
    await scheduleReport(deviceIds, groupIds, report);
    navigate('/reports/scheduled');
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'person':
        return value;
      case 'effDate':
        return formatTime(value, 'date');
      case 'autocalcKmTraveled':
      case 'jumpscalcKmTraveled':
      case 'manualKmTraveled':
        return value != null && value > 0 ? formatDistance(value * 1000, distanceUnit, t) : null;
      case 'autocalcTravelTime':
      case 'manualDayDuration':
        return value != null && value > 0 ? formatNumericHours(value, t) : null;
      case 'maxSpeedKmh':
      case 'avgSpeedKmh':
        return value != null && value > 0 ? formatSpeed(value / 1.852, speedUnit, t) : null;
      case 'totalStops':
        return value != null ? value : 0;
      default:
        return value;
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportTripsSummary']}>
      <div className={classes.header}>
        <ReportFilter onShow={onShow} onExport={onExport} onExportPdf={onExportPdf} onSchedule={onSchedule} deviceType="multiple" loading={loading}>
          <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
        </ReportFilter>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedDevice')}</TableCell>
            {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.map((item, index) => (
            <TableRow key={`${item.person}_${item.effDate}_${index}`}>
              <TableCell>{item.person}</TableCell>
              {columns.map((key) => (
                <TableCell key={key}>
                  {formatValue(item, key)}
                </TableCell>
              ))}
            </TableRow>
          )) : (<TableShimmer columns={columns.length + 1} />)}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default TripsSummaryPage;

