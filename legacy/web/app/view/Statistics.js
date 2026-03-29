/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Ext.define('Traccar.view.Statistics', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'statisticsView',

    requires: [
        'Traccar.view.StatisticsController'
    ],

    controller: 'statistics',
    store: 'Statistics',

    tbar: {
        scrollable: true,
        items: [{
            xtype: 'tbtext',
            html: Strings.reportFrom
        }, {
            xtype: 'datefield',
            reference: 'fromDateField',
            startDay: Traccar.Style.weekStartDay,
            format: Traccar.Style.dateFormat,
            value: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        }, '-', {
            xtype: 'tbtext',
            html: Strings.reportTo
        }, {
            xtype: 'datefield',
            reference: 'toDateField',
            startDay: Traccar.Style.weekStartDay,
            format: Traccar.Style.dateFormat,
            value: new Date()
        }, '-', {
            text: Strings.reportShow,
            handler: 'onShowClick'
        }]
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.statisticsCaptureTime,
            dataIndex: 'captureTime',
            xtype: 'datecolumn',
            renderer: Traccar.AttributeFormatter.defaultFormatter()
        }, {
            text: Strings.statisticsActiveUsers,
            dataIndex: 'activeUsers'
        }, {
            text: Strings.statisticsActiveDevices,
            dataIndex: 'activeDevices'
        }, {
            text: Strings.statisticsRequests,
            dataIndex: 'requests'
        }, {
            text: Strings.statisticsMessagesReceived,
            dataIndex: 'messagesReceived'
        }, {
            text: Strings.statisticsMessagesStored,
            dataIndex: 'messagesStored'
        }, {
            text: Strings.notificatorMail,
            dataIndex: 'mailSent'
        }, {
            text: Strings.notificatorSms,
            dataIndex: 'smsSent'
        }, {
            text: Strings.statisticsGeocoder,
            dataIndex: 'geocoderRequests'
        }, {
            text: Strings.statisticsGeolocation,
            dataIndex: 'geolocationRequests'
        }]
    }
});
