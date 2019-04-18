/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 - 2017 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.ReportConfig', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.ReportConfigController',
        'Traccar.view.CustomTimeField'
    ],

    controller: 'reportConfig',
    title: Strings.reportConfigure,

    items: [{
        fieldLabel: Strings.reportDevice,
        xtype: 'tagfield',
        reference: 'deviceField',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'Devices',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local'
    }, {
        fieldLabel: Strings.userEmail,
        xtype: 'tagfield',
        reference: 'emailField',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'Users',
        valueField: 'id',
        displayField: 'email',
        queryMode: 'local',
        listeners: {
            change: 'onUserEmailChange'
        }
    }, {
        fieldLabel: Strings.userPurchase,
        xtype: 'tagfield',
        reference: 'purchaseField',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'Purchases',
        valueField: 'id',
        displayField: 'id',
        queryMode: 'local'
    }, {
        fieldLabel: Strings.reportGroup,
        xtype: 'tagfield',
        reference: 'groupField',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'Groups',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local'
    }, {
        fieldLabel: Strings.reportEventTypes,
        xtype: 'tagfield',
        reference: 'eventTypeField',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'ReportEventTypes',
        hidden: true,
        valueField: 'type',
        displayField: 'name',
        queryMode: 'local'
    }, {
        fieldLabel: Strings.reportChartType,
        xtype: 'combobox',
        reference: 'chartTypeField',
        store: 'ReportChartTypes',
        hidden: true,
        value: 'speed',
        valueField: 'key',
        displayField: 'name',
        queryMode: 'local'
    }, {
        fieldLabel: Strings.reportShowMarkers,
        xtype: 'checkbox',
        reference: 'showMarkersField',
        inputValue: true,
        uncheckedValue: false,
        value: false
    }, {
        fieldLabel: Strings.reportPeriod,
        reference: 'periodField',
        xtype: 'combobox',
        store: 'ReportPeriods',
        editable: false,
        valueField: 'key',
        displayField: 'name',
        queryMode: 'local',
        listeners: {
            change: 'onPeriodChange'
        }
    }, {
        xtype: 'fieldcontainer',
        layout: 'vbox',
        reference: 'fromContainer',
        hidden: true,
        fieldLabel: Strings.reportFrom,
        items: [{
            xtype: 'datefield',
            reference: 'fromDateField',
            startDay: Traccar.Style.weekStartDay,
            format: Traccar.Style.dateFormat,
            value: new Date(new Date().getTime() - 30 * 60 * 1000)
        }, {
            xtype: 'customTimeField',
            reference: 'fromTimeField',
            value: new Date(new Date().getTime() - 30 * 60 * 1000)
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: 'vbox',
        reference: 'toContainer',
        hidden: true,
        fieldLabel: Strings.reportTo,
        items: [{
            xtype: 'datefield',
            reference: 'toDateField',
            startDay: Traccar.Style.weekStartDay,
            format: Traccar.Style.dateFormat,
            value: new Date()
        }, {
            xtype: 'customTimeField',
            reference: 'toTimeField',
            value: new Date()
        }]
    }],

    buttons: [{
        glyph: 'xf00c@FontAwesome',
        tooltip: Strings.sharedSave,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'onSaveClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
