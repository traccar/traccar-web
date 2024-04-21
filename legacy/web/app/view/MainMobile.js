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

Ext.define('Traccar.view.MainMobile', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainMobile',

    id: 'rootPanel',

    requires: [
        'Traccar.view.edit.Devices',
        'Traccar.view.State',
        'Traccar.view.Report',
        'Traccar.view.Events',
        'Traccar.view.map.Map'
    ],

    layout: 'card',

    items: [{
        layout: 'border',

        defaults: {
            header: false,
            collapsible: true,
            split: true
        },

        items: [{
            region: 'east',
            xtype: 'stateView',
            title: Strings.stateTitle,
            flex: 4,
            collapsed: true,
            collapseMode: 'mini',
            titleCollapse: true,
            floatable: false,
            stateId: 'mobile-state-grid'
        }, {
            region: 'center',
            xtype: 'mapView',
            collapsible: false,
            flex: 2
        }, {
            region: 'south',
            xtype: 'devicesView',
            title: Strings.deviceTitle,
            flex: 1,
            collapsed: true,
            titleCollapse: true,
            floatable: false,
            stateId: 'mobile-devices-grid'
        }]
    }, {
        xtype: 'reportView'
    }, {
        xtype: 'eventsView'
    }]
});
