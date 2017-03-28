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

Ext.define('Traccar.view.dialog.DeviceDistance', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.DeviceDistanceController'
    ],

    controller: 'deviceDistance',
    title: Strings.sharedDeviceDistance,

    items: [{
        xtype: 'combobox',
        reference: 'deviceId',
        fieldLabel: Strings.sharedDevice,
        store: 'AllDevices',
        displayField: 'name',
        valueField: 'id',
        editable: false,
        listeners: {
            change: 'onDeviceChange'
        }
    }, {
        xtype: 'numberfield',
        reference: 'totalDistance',
        fieldLabel: Strings.deviceTotalDistance,
        value: 0
    }],

    buttons: [{
        disabled: true,
        reference: 'setButton',
        glyph: 'xf00c@FontAwesome',
        tooltip: Strings.sharedSet,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'onSetClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
