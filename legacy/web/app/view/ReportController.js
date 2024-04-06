/*
 * Copyright 2015 - 2016 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 Andrey Kunitsyn (andrey@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.ReportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.report',

    requires: [
        'Traccar.AttributeFormatter',
        'Traccar.model.Position',
        'Traccar.model.ReportTrip',
        'Traccar.view.dialog.ReportConfig',
        'Traccar.store.ReportEventTypes'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectdevice: 'deselectReport',
                    selectevent: 'deselectReport',
                    showsingleevent: 'showSingleEvent'
                },
                'map': {
                    selectreport: 'selectReport',
                    deselectfeature: 'deselectFeature'
                }
            },
            global: {
                routegeocode: 'onGeocode'
            },
            store: {
                '#ReportEvents': {
                    add: 'loadRelatedPositions',
                    load: 'loadRelatedPositions'
                },
                '#ReportRoute': {
                    load: 'loadRoute'
                },
                '#ReportStops': {
                    load: 'loadRelatedPositions'
                }
            }
        }
    },

    hideReports: function () {
        Traccar.app.showReports(false);
    },

    getGrid: function () {
        return this.getView().getComponent('grid');
    },

    getChart: function () {
        return this.getView().getComponent('chart');
    },

    init: function () {
        var i, data, attribute;
        data = Ext.getStore('PositionAttributes').getData().items;
        for (i = 0; i < data.length; i++) {
            attribute = data[i];
            this.routeColumns.push({
                text: attribute.get('name'),
                dataIndex: 'attribute.' + attribute.get('key'),
                renderer: Traccar.AttributeFormatter.getAttributeFormatter(attribute.get('key')),
                hidden: true
            });
        }
        if (Traccar.app.getVehicleFeaturesDisabled()) {
            for (i = 0; i < this.summaryColumns.length; i++) {
                if (this.summaryColumns[i].dataIndex.match('engineHours|spentFuel')) {
                    this.summaryColumns[i].hidden = true;
                }
            }
            for (i = 0; i < this.tripsColumns.length; i++) {
                if (this.tripsColumns[i].dataIndex.match('spentFuel|driverUniqueId')) {
                    this.tripsColumns[i].hidden = true;
                }
            }
            for (i = 0; i < this.stopsColumns.length; i++) {
                if (this.stopsColumns[i].dataIndex.match('engineHours|spentFuel')) {
                    this.stopsColumns[i].hidden = true;
                }
            }
        }
    },

    onConfigureClick: function () {
        var dialog = Ext.create('Traccar.view.dialog.ReportConfig');
        dialog.lookupReference('eventTypeField').setHidden(this.lookupReference('reportTypeField').getValue() !== 'events');
        dialog.lookupReference('chartTypeField').setHidden(this.lookupReference('reportTypeField').getValue() !== 'chart');
        dialog.callingPanel = this;
        dialog.lookupReference('deviceField').setValue(this.deviceId);
        dialog.lookupReference('groupField').setValue(this.groupId);
        if (this.eventType !== undefined) {
            dialog.lookupReference('eventTypeField').setValue(this.eventType);
        } else {
            dialog.lookupReference('eventTypeField').setValue([Traccar.store.ReportEventTypes.allEvents]);
        }
        if (this.chartType !== undefined) {
            dialog.lookupReference('chartTypeField').setValue(this.chartType);
        }
        if (this.showMarkers !== undefined) {
            dialog.lookupReference('showMarkersField').setValue(this.showMarkers);
        }
        if (this.fromDate !== undefined) {
            dialog.lookupReference('fromDateField').setValue(this.fromDate);
        }
        if (this.fromTime !== undefined) {
            dialog.lookupReference('fromTimeField').setValue(this.fromTime);
        }
        if (this.toDate !== undefined) {
            dialog.lookupReference('toDateField').setValue(this.toDate);
        }
        if (this.toTime !== undefined) {
            dialog.lookupReference('toTimeField').setValue(this.toTime);
        }
        if (this.period !== undefined) {
            dialog.lookupReference('periodField').setValue(this.period);
        }
        dialog.show();
    },

    updateButtons: function () {
        var reportType, disabled, devices, time;
        reportType = this.lookupReference('reportTypeField').getValue();
        devices = this.deviceId && this.deviceId.length !== 0 || this.groupId && this.groupId.length !== 0;
        time = this.fromDate && this.fromTime && this.toDate && this.toTime;
        disabled = !reportType || !devices || !time || this.reportProgress;
        this.lookupReference('showButton').setDisabled(disabled);
        this.lookupReference('exportButton').setDisabled(reportType === 'chart' || disabled);
        this.lookupReference('emailButton').setDisabled(reportType === 'chart' || disabled);
    },

    onReportClick: function (button) {
        var reportType, from, to, store, url, daily;

        this.getGrid().getSelectionModel().deselectAll();

        reportType = this.lookupReference('reportTypeField').getValue();
        if (reportType && (this.deviceId || this.groupId)) {
            from = new Date(
                this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate(),
                this.fromTime.getHours(), this.fromTime.getMinutes(), this.fromTime.getSeconds(), this.fromTime.getMilliseconds());

            to = new Date(
                this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate(),
                this.toTime.getHours(), this.toTime.getMinutes(), this.toTime.getSeconds(), this.toTime.getMilliseconds());

            daily = reportType === 'daily';

            this.reportProgress = true;
            this.updateButtons();

            if (button.reference === 'showButton') {
                if (reportType === 'chart') {
                    store = this.getChart().getStore();
                    this.getChart().setSeries([]);
                } else {
                    store = this.getGrid().getStore();
                }
                store.showMarkers = this.showMarkers;
                store.load({
                    scope: this,
                    callback: function () {
                        this.reportProgress = false;
                        this.updateButtons();
                    },
                    params: {
                        deviceId: this.deviceId,
                        groupId: this.groupId,
                        type: this.eventType,
                        from: from.toISOString(),
                        to: to.toISOString(),
                        daily: daily
                    }
                });
            } else {
                url = this.getGrid().getStore().getProxy().url;
                this.excelReport(url, {
                    deviceId: this.deviceId,
                    groupId: this.groupId,
                    type: this.eventType,
                    from: Ext.Date.format(from, 'c'),
                    to: Ext.Date.format(to, 'c'),
                    daily: daily,
                    mail: button.reference === 'emailButton'
                });
            }
        }
    },

    onClearClick: function () {
        var reportType = this.lookupReference('reportTypeField').getValue();
        this.clearReport(reportType);
    },

    clearReport: function (reportType) {
        this.getGrid().getStore().removeAll();
        if (reportType === 'trips' || reportType === 'events' || reportType === 'stops') {
            Ext.getStore('ReportRoute').removeAll();
        }
        if (reportType === 'chart') {
            this.getChart().getStore().removeAll();
        }
    },

    onSelectionChange: function (selection, selected) {
        var report;
        if (selected.length > 0) {
            report = selected[0];
            this.fireEvent('selectreport', report, true);
            if (report instanceof Traccar.model.ReportTrip) {
                this.selectTrip(report);
            }
            if (report instanceof Traccar.model.Event || report instanceof Traccar.model.ReportStop) {
                this.selectPositionRelated(report);
            }
        }
    },

    selectReport: function (object) {
        var positionRelated, reportType = this.lookupReference('reportTypeField').getValue();
        if (object instanceof Traccar.model.Position) {
            if (reportType === 'route') {
                this.getGrid().getSelectionModel().select([object], false, true);
                this.getGrid().getView().focusRow(object);
            } else if (reportType === 'events' || reportType === 'stops') {
                positionRelated = this.getGrid().getStore().findRecord('positionId', object.get('id'), 0, false, true, true);
                this.getGrid().getSelectionModel().select([positionRelated], false, true);
                this.getGrid().getView().focusRow(positionRelated);
            }
        }
    },

    deselectReport: function (object) {
        if (object) {
            this.deselectFeature();
        }
    },

    deselectFeature: function () {
        if (this.lookupReference('reportTypeField').getValue() !== 'trips') {
            this.getGrid().getSelectionModel().deselectAll();
        }
    },

    selectTrip: function (trip) {
        var from, to;
        from = new Date(trip.get('startTime'));
        to = new Date(trip.get('endTime'));
        Ext.getStore('ReportRoute').removeAll();
        Ext.getStore('ReportRoute').showMarkers = this.showMarkers;
        Ext.getStore('ReportRoute').load({
            params: {
                deviceId: trip.get('deviceId'),
                from: from.toISOString(),
                to: to.toISOString()
            }
        });
    },

    selectPositionRelated: function (report) {
        var position;
        if (report.get('positionId')) {
            position = Ext.getStore('ReportRoute').getById(report.get('positionId'));
            if (position) {
                this.fireEvent('selectreport', position, true);
            }
        }
    },

    loadRelatedPositions: function (store, data) {
        var i, reportObject, positionIds = [];
        Ext.getStore('ReportRoute').removeAll();
        if (data) {
            for (i = 0; i < data.length; i++) {
                reportObject = data[i];
                if (reportObject.get('positionId')) {
                    positionIds.push(reportObject.get('positionId'));
                }
            }
        }
        if (positionIds.length > 0) {
            Ext.getStore('Positions').load({
                params: {
                    id: positionIds
                },
                scope: this,
                callback: function (records, operation, success) {
                    if (success) {
                        Ext.getStore('ReportRoute').showMarkers = this.showMarkers;
                        Ext.getStore('ReportRoute').add(records);
                        if (records.length === 1) {
                            this.fireEvent('selectreport', records[0], false);
                        }
                    }
                }
            });
        }
    },

    loadRoute: function (store) {
        var i, deviceIds, chartSeries, deviceStore;
        if (this.lookupReference('reportTypeField').getValue() === 'chart') {
            this.getChart().getAxes()[0].setTitle(
                Ext.getStore('ReportChartTypes').findRecord('key', this.chartType).get('name'));
            chartSeries = [];
            deviceIds = store.collect('deviceId');
            for (i = 0; i < deviceIds.length; i++) {
                deviceStore = Ext.create('Ext.data.ChainedStore', {
                    source: 'ReportRoute',
                    filters: [{
                        property: 'deviceId',
                        value: deviceIds[i]
                    }]
                });
                chartSeries.push({
                    type: 'line',
                    store: deviceStore,
                    yField: this.chartType,
                    xField: 'fixTime',
                    highlightCfg: {
                        scaling: Traccar.Style.chartMarkerHighlightScaling
                    },
                    colors: [Traccar.app.getReportColor(deviceIds[i])],
                    marker: {
                        type: 'circle',
                        radius: Traccar.Style.chartMarkerRadius,
                        fill: Traccar.app.getReportColor(deviceIds[i])
                    }
                });
            }
            this.getChart().setSeries(chartSeries);
        }
    },

    onChartMarkerClick: function (chart, item) {
        this.fireEvent('selectreport', item.record, true);
    },

    showSingleEvent: function (eventId) {
        this.lookupReference('reportTypeField').setValue('events');
        Ext.getStore('Events').load({
            id: eventId,
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    Ext.getStore('ReportEvents').add(records);
                    if (records.length > 0) {
                        if (!records[0].get('positionId')) {
                            if (Traccar.app.isMobile()) {
                                Traccar.app.showReports(true);
                            } else {
                                this.getView().expand();
                            }
                        }
                        this.getGrid().getSelectionModel().select([records[0]], false, true);
                        this.getGrid().getView().focusRow(records[0]);
                    }
                }
            }
        });
    },

    excelReport: function (requestUrl, requestParams) {
        Ext.Ajax.request({
            url: requestUrl,
            method: 'GET',
            timeout: Traccar.Style.reportTimeout,
            params: requestParams,
            headers: {
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            binary: true,
            scope: this,
            callback: function (options, success, response) {
                var disposition, filename, type, blob, url, downloadUrl;
                if (success && !requestParams.mail) {
                    disposition = response.getResponseHeader('Content-Disposition');
                    filename = disposition.slice(disposition.indexOf('=') + 1, disposition.length);
                    type = response.getResponseHeader('Content-Type');
                    blob = new Blob([response.responseBytes], {type: type});
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        url = window.URL || window.webkitURL;
                        downloadUrl = url.createObjectURL(blob);
                        if (filename) {
                            Ext.dom.Helper.append(Ext.getBody(), {
                                tag: 'a',
                                href: downloadUrl,
                                download: filename
                            }).click();
                        }
                        setTimeout(function () {
                            url.revokeObjectURL(downloadUrl);
                        }, 100);
                    }
                }
                this.reportProgress = false;
                this.updateButtons();
            }
        });
    },

    onTypeChange: function (combobox, newValue, oldValue) {
        if (oldValue !== null) {
            this.clearReport(oldValue);
        }

        if (newValue === 'route') {
            this.getGrid().reconfigure('ReportRoute', this.routeColumns);
            this.getView().getLayout().setActiveItem('grid');
        } else if (newValue === 'events') {
            this.getGrid().reconfigure('ReportEvents', this.eventsColumns);
            this.getView().getLayout().setActiveItem('grid');
        } else if (newValue === 'summary' || newValue === 'daily') {
            this.getGrid().reconfigure('ReportSummary', this.summaryColumns);
            this.getView().getLayout().setActiveItem('grid');
        } else if (newValue === 'trips') {
            this.getGrid().reconfigure('ReportTrips', this.tripsColumns);
            this.getView().getLayout().setActiveItem('grid');
        } else if (newValue === 'stops') {
            this.getGrid().reconfigure('ReportStops', this.stopsColumns);
            this.getView().getLayout().setActiveItem('grid');
        } else if (newValue === 'chart') {
            this.getView().getLayout().setActiveItem('chart');
        }

        this.updateButtons();
    },

    onGeocode: function (positionId) {
        var position = Ext.getStore('ReportRoute').getById(positionId);
        if (position && !position.get('address')) {
            Ext.Ajax.request({
                scope: this,
                method: 'GET',
                url: 'api/server/geocode',
                params: {
                    latitude: position.get('latitude'),
                    longitude: position.get('longitude')
                },
                success: function (response) {
                    position.set('address', response.responseText);
                    position.commit();
                    this.fireEvent('selectReport', position);
                },
                failure: function (response) {
                    Traccar.app.showError(response);
                }
            });
        }
    },

    routeColumns: [{
        text: Strings.reportDeviceName,
        dataIndex: 'deviceId',
        renderer: Traccar.AttributeFormatter.getFormatter('deviceId')
    }, {
        text: Strings.positionValid,
        dataIndex: 'valid',
        renderer: Traccar.AttributeFormatter.getFormatter('valid')
    }, {
        text: Strings.positionFixTime,
        dataIndex: 'fixTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.getFormatter('fixTime')
    }, {
        text: Strings.positionLatitude,
        dataIndex: 'latitude',
        renderer: Traccar.AttributeFormatter.getFormatter('latitude')
    }, {
        text: Strings.positionLongitude,
        dataIndex: 'longitude',
        renderer: Traccar.AttributeFormatter.getFormatter('longitude')
    }, {
        text: Strings.positionAltitude,
        dataIndex: 'altitude',
        renderer: Traccar.AttributeFormatter.getFormatter('altitude')
    }, {
        text: Strings.positionSpeed,
        dataIndex: 'speed',
        renderer: Traccar.AttributeFormatter.getFormatter('speed')
    }, {
        text: Strings.positionAddress,
        dataIndex: 'address',
        renderer: function (value, metaData, record) {
            if (!value) {
                return '<a href="#" onclick="Ext.fireEvent(\'routegeocode\', ' +
                    record.getId() + ')" >' +
                    Strings.sharedShowAddress + '</a>';
            }
            return Traccar.AttributeFormatter.getFormatter('address')(value);
        }
    }],

    eventsColumns: [{
        text: Strings.positionFixTime,
        dataIndex: 'eventTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.getFormatter('eventTime')
    }, {
        text: Strings.reportDeviceName,
        dataIndex: 'deviceId',
        renderer: Traccar.AttributeFormatter.getFormatter('deviceId')
    }, {
        text: Strings.sharedType,
        dataIndex: 'type',
        renderer: function (value) {
            return Traccar.app.getEventString(value);
        }
    }, {
        text: Strings.positionAlarm,
        dataIndex: 'attributes',
        renderer: function (value) {
            return value['alarm'];
        }
    }, {
        text: Strings.sharedGeofence,
        dataIndex: 'geofenceId',
        renderer: Traccar.AttributeFormatter.getFormatter('geofenceId')
    }, {
        text: Strings.sharedMaintenance,
        dataIndex: 'maintenanceId',
        renderer: Traccar.AttributeFormatter.getFormatter('maintenanceId')
    }],

    summaryColumns: [{
        text: Strings.reportDeviceName,
        dataIndex: 'deviceId',
        renderer: Traccar.AttributeFormatter.getFormatter('deviceId')
    }, {
        text: Strings.reportStartDate,
        dataIndex: 'startTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.dateFormatter
    }, {
        text: Strings.sharedDistance,
        dataIndex: 'distance',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.reportStartOdometer,
        dataIndex: 'startOdometer',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.reportEndOdometer,
        dataIndex: 'endOdometer',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.reportAverageSpeed,
        dataIndex: 'averageSpeed',
        renderer: Traccar.AttributeFormatter.getFormatter('speed')
    }, {
        text: Strings.reportMaximumSpeed,
        dataIndex: 'maxSpeed',
        renderer: Traccar.AttributeFormatter.getFormatter('speed')
    }, {
        text: Strings.reportEngineHours,
        dataIndex: 'engineHours',
        renderer: Traccar.AttributeFormatter.getFormatter('duration')
    }, {
        text: Strings.reportSpentFuel,
        dataIndex: 'spentFuel',
        renderer: Traccar.AttributeFormatter.getFormatter('spentFuel')
    }],

    tripsColumns: [{
        text: Strings.reportDeviceName,
        dataIndex: 'deviceId',
        renderer: Traccar.AttributeFormatter.getFormatter('deviceId')
    }, {
        text: Strings.reportStartTime,
        dataIndex: 'startTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.getFormatter('startTime')
    }, {
        text: Strings.reportStartOdometer,
        dataIndex: 'startOdometer',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.reportStartAddress,
        dataIndex: 'startAddress',
        renderer: Traccar.AttributeFormatter.getFormatter('address')
    }, {
        text: Strings.reportEndTime,
        dataIndex: 'endTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.getFormatter('endTime')
    }, {
        text: Strings.reportEndOdometer,
        dataIndex: 'endOdometer',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.reportEndAddress,
        dataIndex: 'endAddress',
        renderer: Traccar.AttributeFormatter.getFormatter('address')
    }, {
        text: Strings.sharedDistance,
        dataIndex: 'distance',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.reportAverageSpeed,
        dataIndex: 'averageSpeed',
        renderer: Traccar.AttributeFormatter.getFormatter('speed')
    }, {
        text: Strings.reportMaximumSpeed,
        dataIndex: 'maxSpeed',
        renderer: Traccar.AttributeFormatter.getFormatter('speed')
    }, {
        text: Strings.reportDuration,
        dataIndex: 'duration',
        renderer: Traccar.AttributeFormatter.getFormatter('duration')
    }, {
        text: Strings.reportSpentFuel,
        dataIndex: 'spentFuel',
        renderer: Traccar.AttributeFormatter.getFormatter('spentFuel')
    }, {
        text: Strings.sharedDriver,
        dataIndex: 'driverUniqueId',
        renderer: Traccar.AttributeFormatter.getFormatter('driverUniqueId')
    }],

    stopsColumns: [{
        text: Strings.reportDeviceName,
        dataIndex: 'deviceId',
        renderer: Traccar.AttributeFormatter.getFormatter('deviceId')
    }, {
        text: Strings.reportStartTime,
        dataIndex: 'startTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.getFormatter('startTime')
    }, {
        text: Strings.positionOdometer,
        dataIndex: 'startOdometer',
        renderer: Traccar.AttributeFormatter.getFormatter('distance')
    }, {
        text: Strings.positionAddress,
        dataIndex: 'address',
        renderer: Traccar.AttributeFormatter.getFormatter('address')
    }, {
        text: Strings.reportEndTime,
        dataIndex: 'endTime',
        xtype: 'datecolumn',
        renderer: Traccar.AttributeFormatter.getFormatter('endTime')
    }, {
        text: Strings.reportDuration,
        dataIndex: 'duration',
        renderer: Traccar.AttributeFormatter.getFormatter('duration')
    }, {
        text: Strings.reportEngineHours,
        dataIndex: 'engineHours',
        renderer: Traccar.AttributeFormatter.getFormatter('duration')
    }, {
        text: Strings.reportSpentFuel,
        dataIndex: 'spentFuel',
        renderer: Traccar.AttributeFormatter.getFormatter('spentFuel')
    }]
});
