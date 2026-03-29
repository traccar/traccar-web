/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.Main', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.main',

    requires: [
        'Traccar.view.MainController',
        'Traccar.view.edit.Devices',
        'Traccar.view.State',
        'Traccar.view.Report',
        'Traccar.view.Events',
        'Traccar.view.map.Map'
    ],

    controller: 'mainController',

    layout: 'border',

    defaults: {
        header: false,
        collapsible: true,
        split: true
    },

    items: [{
        region: 'west',
        layout: 'border',
        width: Traccar.Style.deviceWidth,
        title: Strings.devicesAndState,
        titleCollapse: true,
        floatable: false,
        stateful: true,
        stateId: 'devices-and-state-panel',

        defaults: {
            split: true,
            flex: 1
        },

        items: [{
            region: 'center',
            xtype: 'devicesView'
        }, {
            region: 'south',
            xtype: 'stateView'
        }]
    }, {
        region: 'south',
        xtype: 'reportView',
        reference: 'reportView',
        height: Traccar.Style.reportHeight,
        collapsed: true,
        titleCollapse: true,
        floatable: false
    }, {
        region: 'center',
        xtype: 'mapView',
        collapsible: false
    }, {
        region: 'east',
        xtype: 'eventsView',
        reference: 'eventsView',
        width: Traccar.Style.deviceWidth,
        collapsed: true,
        titleCollapse: true,
        floatable: false
    }]
});
